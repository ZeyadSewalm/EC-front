import { Component, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from 'src/app/shared/services/cart.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CartSummary } from 'src/app/shared/interfaces/cart-summary';
import { UserCart } from 'src/app/shared/interfaces/user-cart';
import { ProductCostPipe } from 'src/app/shared/pipes/product-cost.pipe';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonService } from 'src/app/shared/services/common.service';
import { LoadingComponent } from '../loading/loading.component';


@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ProductCostPipe , TranslateModule, LoadingComponent],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  constructor(
    private _CommonService:CommonService,
    private _CartService: CartService,
    private _FormBuilder: FormBuilder,
    private _AuthService: AuthService,
    private _Router: Router,
    private _Renderer2: Renderer2,
    private _ToastrService: ToastrService,
    private translate:TranslateService
  ) {}

  userCartProducts: UserCart[] = [];
  userCartTotalSummary: CartSummary = {} as CartSummary;
  userId: number = 0;
  noItems: boolean = false;
  itemsCartCount: number = 0;
  render: boolean = false;
  cartloading:boolean=true
  currentLang:string = ''
  isArabic(): boolean {
    return this.translate.currentLang === 'ar';
  }
  getCartSummary() {
    this._CartService.getCartTotalSummary(this.userId, this.userId).subscribe({
      next: (response) => {
        console.log('totalSummary', response);
        this.userCartTotalSummary = response;
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      },
    });
  }

  getUserCart() {
    this.cartloading=true
    this._CartService.getUserCart(this.userId, this.userId , this.currentLang ).subscribe({
      next: (response) => {
        console.log('CART', response);
        this.userCartProducts = response;
        if (response.length == 0) {
          this.noItems = true;
        }
        this.cartloading=false
        this.render = true;
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
        this.render = true;
      },
    });
  }

  ngOnInit(): void {
    this._AuthService.decodeToken();
    if (this._AuthService.userInfo !== 'notLogin') {
      this.userId = this._AuthService.userInfo.user_id;
      // get current lang
      this._CommonService.currentLang.subscribe({
        next: (res) => {
          console.log(res , 'cartlang');
          this.currentLang = res;
          this.getUserCart();
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
        },
      });
      this.getCartSummary();
    } else {
      console.log('visitor');
      this.render = true;
      this.noItems = true;
    }


  }

  // --------------------------------------------------------------------------------(Forms)

  // personal data

  PersonalInfo: FormGroup = this._FormBuilder.group({
    full_name: ['', [Validators.required]],
    // email: ['', ],
    phone: [
      '',
      [Validators.required],
    ],
  });

  // shipping address

  shippingAddress: FormGroup = this._FormBuilder.group({
    Address: ['', [Validators.required]],
    City: ['', [Validators.required]],
    State: ['', [Validators.required]],
    // Country: ['', [Validators.required]],
  });

  // --------------------------------------------------------------------------------

  // item count
  increaseCount(e: any) {
    let x: number = Number(e.target.closest('.parent').children[1].innerText);
    x++;
    e.target.closest('.parent').children[1].innerText = x;
  }
  minusCount(e: any) {
    let x: number = Number(e.target.closest('.parent').children[1].innerText);
    x--;

    if (x == 1) {
      e.target.closest('.parent').children[1].innerText = 1;
    }
    if (x > 1) {
      e.target.closest('.parent').children[1].innerText = x;
    }
  }
  @ViewChildren('input') inputs!: QueryList<any>;

  checkOut() {
    if (this.PersonalInfo.valid && this.shippingAddress.valid) {
      const itemData: FormGroup = this._FormBuilder.group({
        full_name: this.PersonalInfo.get('full_name')?.value,
        user_id: this.userId,
        // email: this.PersonalInfo.get('email')?.value,
        mobile: this.PersonalInfo.get('phone')?.value,
        address: this.shippingAddress.get('Address')?.value,
        // country: this.shippingAddress.get('Country')?.value,
        state: this.shippingAddress.get('State')?.value,
        city: this.shippingAddress.get('City')?.value,
        cart_id: this.userId,
      });

      const formData = new FormData();
      Object.keys(itemData.value).forEach((key) => {
        formData.append(key, itemData.get(key)?.value);
      });
      this._CartService.createOrder(formData).subscribe({
        next: (res) => {
          console.log(res);
          if (res.message == 'Order created successfully') {
            this._Router.navigate(['/checkOut', res.order_oid]);
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
    } else {
      for (const input of this.inputs) {
        if (input.nativeElement.value == '') {
          this._Renderer2.addClass(input.nativeElement, 'is-invalid');
        } else {
          this._Renderer2.removeClass(input.nativeElement, 'is-invalid');
          this._Renderer2.addClass(input.nativeElement, 'is-valid');
        }
      }
    }
  }

  @ViewChild('qty') itemQty!: any;

  updateCart(
    productId: number,
    Price: string,
    shipping: string,
    size: string,
    color: string
  ) {
    this._AuthService.decodeToken();
    const userId: number = this._AuthService.userInfo.user_id;
    let itemQty: number = Number(this.itemQty.nativeElement.innerText);
    console.log(itemQty);

    // let userCountry: string = '';

    // this._CartService.getUserCountry().subscribe({
    //   next: (res) => {
    //     userCountry = res;
    //   },
    //   error: (err: HttpErrorResponse) => {},
    // });

    const itemData: FormGroup = this._FormBuilder.group({
      product_id: productId,
      user_id: userId,
      qty: itemQty,
      price: Price,
      shipping_amount: shipping,
      // country: userCountry,
      size: size,
      color: color,
      cart_id: userId,
      currency:this.userCartProducts[0].currency
    });

    const formData = new FormData();
    Object.keys(itemData.value).forEach((key) => {
      formData.append(key, itemData.get(key)?.value);
    });

    this._CartService.updateCart(formData , this.currentLang).subscribe({
      next: (response) => {
        console.log('up', response);
        this.getCartSummary();
        if (response.message == 'Cart Updated Successfully' && this.currentLang == 'en') {
          this._ToastrService.success('Your update is done');
          const toaster:any = document.querySelector(".overlay-container")
          toaster.style.direction = 'ltr'
        }
        else if (response.message == 'تم تحديث السلة بنجاح' && this.currentLang == 'ar') {
          this._ToastrService.success('تم التعديل بنجاح');
          const toaster:any = document.querySelector(".overlay-container")
          toaster.style.direction = 'rtl'
        }

      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
        console.log(formData);
        this._ToastrService.error(err.error.message);
      },
    });
  }

  deleteItem(id: number) {
    this._CartService.removeItem(this.userId, id, this.userId).subscribe({
      next: (res) => {
        console.log(res);
        if (res == null) {
          this.getUserCart();
          this.getCartSummary();
          if (res == null && this.currentLang =="en") {
            this._ToastrService.success('The Product was removed');
            const toaster:any = document.querySelector(".overlay-container")
            toaster.style.direction = 'ltr'
          }
          else if(res == null && this.currentLang == "ar"){
            this._ToastrService.success('تم حذف المنتج من عربة التسوق');
            const toaster:any = document.querySelector(".overlay-container")
            toaster.style.direction = 'rtl'
          }
          this._CartService.getUserCart(this.userId, this.userId , this.currentLang).subscribe({
            next: (response) => {
              this.itemsCartCount = response.length;
              this._CartService.cartItemsNumber.next(this.itemsCartCount);
            },
            error: (err: HttpErrorResponse) => {
              console.log(err);
            },
          });
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
