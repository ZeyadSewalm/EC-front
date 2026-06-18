import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CartSummary } from 'src/app/shared/interfaces/cart-summary';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CartService } from 'src/app/shared/services/cart.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from 'src/app/shared/services/payment.service';
import { OrderData } from 'src/app/shared/interfaces/order-data';
import { CommonService } from 'src/app/shared/services/common.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, TranslateModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  constructor(
    private _CommonService: CommonService,
    private _FormBuilder: FormBuilder,
    private _Renderer2: Renderer2,
    private _AuthService: AuthService,
    private _PaymentService: PaymentService,
    private _CartService: CartService,
    private _ActivatedRoute: ActivatedRoute,
    private http: HttpClient,
    private _Router: Router,
    private translate: TranslateService,
    private _ToastrService: ToastrService,
    private router: Router
  ) {}

  shippingAddress: FormGroup = this._FormBuilder.group({
    full_name: [''],
    email: [''],
    phone: [''],
    Address: [''],
    City: [''],
    State: [''],
    Country: [''],
  });

  userInfo: any = {};
  userAddress: any = {};
  orderId: any = '';
  userId: number = 0;
  itemsCartCount: any;
  codeMsgSuccess: string = '';
  codeMsgWarning: string = '';
  codeMsgError: string = '';
  currentLang: string = '';
  orderData: OrderData = {} as OrderData;
  discount: any;

  paymentMethod: string = '';
  phone: string = '';
  private baseUrl = environment.baseURL;

  setPaymentMethod(method: any): void {
    this.paymentMethod = method.value;
  }
  submitForm() {
    if (this.paymentMethod === 'cash') {
      this._PaymentService.paymentCash(this.orderId).subscribe({
        next: (res) => {
          const status = 'success';
          const id = this.orderId;
          this.router.navigate([`/order-success`, status, id]);
        },
        error: (err) => {
          const status = 'fail';
          const id = this.orderId;
          this.router.navigate([`/order-success`, status, id]);
        },
      });
    } else {
      let url = `${this.baseUrl}/v1/paymob-test/${this.orderId}/${this.paymentMethod}/`;
      if (this.paymentMethod === 'wallet') {
        url += `?phone_num=${this.phone}`;
      }
      console.log('url', url);
      window.location.href = url;
    }
  }
  // get order details func
  getOrderDetails() {
    this._CartService.getOrderDetails(this.orderId).subscribe({
      next: (res) => {
        console.log(res);
        this.orderData = res;
        this.shippingAddress.get('full_name')?.setValue(res.full_name);
        this.shippingAddress.get('email')?.setValue(res.email);
        this.shippingAddress.get('phone')?.setValue(res.mobile);
        this.shippingAddress.get('Address')?.setValue(res.address);
        this.shippingAddress.get('City')?.setValue(res.city);
        this.shippingAddress.get('State')?.setValue(res.state);
        this.shippingAddress.get('Country')?.setValue(res.country);
        if (res.saved !== '0.00') {
          this.discount = true;
        } else {
          this.discount = false;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  ngOnInit(): void {
    // get current lang
    this._CommonService.currentLang.subscribe({
      next: (res) => {
        console.log(res);
        this.currentLang = res;
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      },
    });
    // get orderId from url
    this._ActivatedRoute.paramMap.subscribe({
      next: (param) => {
        console.log(param.get('id'));
        this.orderId = param.get('id');
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.getOrderDetails();

    // get userId from token
    this._AuthService.decodeToken();
    this.userId = this._AuthService.userInfo.user_id;
    console.log(this.userId);

    // get itemsCartCount
    this._CartService
      .getUserCart(this.userId, this.userId, this.currentLang)
      .subscribe({
        next: (response) => {
          this.itemsCartCount = response.length;
          console.log(response.length);
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
        },
      });
  }

  // copon func
  applyCopon(code: string) {
    const codeData: any = {
      coupon_code: code,
      order_oid: this.orderId,
    };
    this._PaymentService.applyCopon(codeData).subscribe({
      next: (res) => {
        console.log(res);

        if (res.icon == 'success') {
          this.codeMsgSuccess = 'Coupon Activated';
          this.getOrderDetails();
        } else if (res.icon == 'warning') {
          this.codeMsgWarning = 'Coupon Already Activated';
        } else if (res.icon == 'error') {
          this.codeMsgError = 'Coupon Does Not Exist';
        }
      },
      error: (err) => {
        console.log(err);
        this.codeMsgError=err.error.message;
      },
    });
  }

  payStripe(): any {
    return `https://levado-ecommerce-api.onrender.com/api/v1/stripe-checkout/${this.orderId}/${this.userId}/`;
  }

  closeCoponAlert() {
    this.codeMsgSuccess = '';
    this.codeMsgWarning = '';
    this.codeMsgError = '';
  }

  isArabic(): boolean {
    return this.translate.currentLang === 'ar';
  }
}
