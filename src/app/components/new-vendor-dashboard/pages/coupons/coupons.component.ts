import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorCoponsService } from 'src/app/shared/services/vendor-copons.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LoadingComponent } from 'src/app/components/loading/loading.component';

@Component({
  selector: 'app-vendor-coupons',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    LoadingComponent,
  ],
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.scss'],
})
export class CouponsComponent implements OnInit {
  constructor(
    private _FormBuilder: FormBuilder,
    private _VendorCoponsService: VendorCoponsService,
    private _AuthService: AuthService,
    private _Renderer2: Renderer2,
    private translate: TranslateService
  ) {}

  allCoupons: any[] = [];
  allCouponsNum: any;
  activateCoupons: any;
  couponId: number = 0;
  vendorId: number = 0;
  couponsName: string[] = [];
  loading: boolean = true;
  couponStatus() {
    this.loading = true;
    this._VendorCoponsService.couponsStatus(this.vendorId).subscribe({
      next: (res) => {
        console.log(res);
        this.allCouponsNum = res[0].total_coupons;
        this.activateCoupons = res[0].active_coupons;
        this.loading = false;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // all coupons
  couponDataForm: FormGroup = this._FormBuilder.group({
    code: ['', [Validators.required]],
    discount_type: ['percent', [Validators.required]],
    discount_value: ['', [Validators.required, Validators.min(1)]],
    usage_limit: [null], // optional
    valid_from: [null], // optional
    valid_to: [null], // optional
    active: [false],
  });

  createCoupon(layer: HTMLDivElement, alert: HTMLDivElement) {
    if (this.couponDataForm.valid) {
      for (const couponName of this.allCoupons) {
        this.couponsName.push(couponName.code);
      }

      if (this.couponsName.includes(this.couponDataForm.get('code')?.value)) {
        this._Renderer2.removeClass(alert, 'd-none');
      } else {
        const itemData = {
          vendor_id: this.vendorId,
          code: this.couponDataForm.get('code')?.value,
          discount_type: this.couponDataForm.get('discount_type')?.value,
          discount_value: this.couponDataForm.get('discount_value')?.value,
          usage_limit: this.couponDataForm.get('usage_limit')?.value,
          valid_from: this.couponDataForm.get('valid_from')?.value,
          valid_to: this.couponDataForm.get('valid_to')?.value,
          active: this.couponDataForm.get('active')?.value,
        };

        const formData = new FormData();
        Object.keys(itemData).forEach((key) => {
          formData.append(key, (itemData as any)[key]);
        });

        this._VendorCoponsService
          .createCoupon(this.vendorId, formData)
          .subscribe({
            next: (res) => {
              console.log(res);
              this._Renderer2.addClass(layer, 'd-none');
              if (res.message == 'Coupon Created Successfully.') {
                this.getAllCoupons();
              }
            },
            error: (err) => {
              console.log(err);
            },
          });
      }
    } else {
      console.log('all inputs are required');
      this.couponDataForm.markAllAsTouched();
    }
  }

  getAllCoupons() {
    this.loading = true;
    this._VendorCoponsService.listCoupons(this.vendorId).subscribe({
      next: (res) => {
        console.log(res, 'allcop');
        this.allCoupons = res;
        this.loading = false;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  ngOnInit(): void {
    this._AuthService.decodeToken();
    this.vendorId = this._AuthService.userInfo.vendor_id;
    // get all coupons
    this.getAllCoupons();
    this.couponStatus();
  }


  closeLayer(layer: HTMLDivElement) {
    this._Renderer2.addClass(layer, 'd-none');
    this.couponId = 0;
  }

  // delete coupon
  deleteCoupon(id: number) {
    this._VendorCoponsService.deleteCoupon(this.vendorId, id).subscribe({
      next: (res) => {
        console.log(res);
        if (res == null) {
          this.getAllCoupons();
          this.couponStatus();
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  // coupon details
  couponDetails(
    couponId: number,
    layer: HTMLDivElement,
    formButtons: HTMLDivElement
  ) {
    this.couponId = couponId;
    this._VendorCoponsService.couponDetails(this.vendorId, couponId).subscribe({
      next: (res) => {
        console.log(res);
        this._Renderer2.removeClass(layer, 'd-none');

        // Fill form values from response
        this.couponDataForm.patchValue({
          code: res.code,
          discount_type: res.discount_type,
          discount_value: res.discount_value,
          usage_limit: res.usage_limit,
          valid_from: res.valid_from ? res.valid_from.split('T')[0] : null,
          valid_to: res.valid_to ? res.valid_to.split('T')[0] : null,
          active: res.active,
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // update coupon
  updateCoupon(couponId: number, layer: HTMLDivElement) {
    if (this.couponDataForm.valid) {
      const formData = new FormData();

      Object.entries(this.couponDataForm.value).forEach(([key, value]) => {
        if (value instanceof File) {
          // لو القيمة عبارة عن ملف
          formData.append(key, value);
        } else if (value !== null && value !== undefined) {
          if (typeof value === 'object') {
            // أي object (مثلاً dates أو arrays)
            formData.append(key, JSON.stringify(value));
          } else {
            // أي primitive تاني (string, number, boolean)
            formData.append(key, value.toString());
          }
        }
      });

      if (this.vendorId != null) {
        formData.append('vendor_id', this.vendorId.toString());
      }
      formData.append('vendor_id', 'undefined');

      this._VendorCoponsService
        .updateCoupon(this.vendorId, couponId, formData)
        .subscribe({
          next: (res) => {
            console.log(res);
            this._Renderer2.addClass(layer, 'd-none');
            this.getAllCoupons();
            this.couponStatus();
          },
          error: (err) => {
            console.log(err);
          },
        });
    } else {
      console.log('all inputs are required');
      this.couponDataForm.markAllAsTouched();
    }
  }

  // reset form for creating new coupon
  editCoupon(layer: HTMLDivElement) {
    this.couponId = 0;
    this.couponDataForm.reset({
      code: '',
      discount_type: 'percent',
      discount_value: 0,
      usage_limit: null,
      valid_from: null,
      valid_to: null,
      active: false,
    });
    this._Renderer2.removeClass(layer, 'd-none');
  }

  isArabic(): boolean {
    return this.translate.currentLang === 'ar';
  }
}
