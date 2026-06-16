import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { jwtDecode } from 'jwt-decode';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ToastrService } from 'ngx-toastr';
import { Products } from 'src/app/shared/interfaces/products';
import { Wishlist } from 'src/app/shared/interfaces/wishlist';
import { CommonService } from 'src/app/shared/services/common.service';
import { ProductsService } from 'src/app/shared/services/products.service';
import { WishlistService } from 'src/app/shared/services/wishlist.service';
import { LoadingComponent } from '../loading/loading.component';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink, LazyLoadImageModule, TranslateModule, LoadingComponent],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
})
export class WishlistComponent implements OnInit {
  userId: any;
  allProducts: Products[] = [];
  formData = new FormData();
  wishlistData: Wishlist[] = [];
  render: boolean = false;
  loading: boolean = false;
  currentLang:string = ''
  constructor(
    private _WishlistService: WishlistService,
    private _ToastrService: ToastrService,
    private _ProductsService: ProductsService,
    private _CommonService: CommonService,
    private translate:TranslateService,
    private _AuthService:AuthService
  ) {}
  currency: any;
  ngOnInit(): void {
    this.decodeToken();
    if (this.userId !== 'notLogin') {
      this.formData.append('user_id', this.userId.user_id.toString());
    } else {
      console.log('visitor');
      this.render = true;
    }
    // get currecy value
    this._CommonService.currency.subscribe({
      next: (res) => {
        this.currency = res.label;
        console.log(this.currency);
        this.getAllWishlist();
      },
    });
   // get current lang
   this._CommonService.currentLang.subscribe({
    next: (res) => {
      console.log(res);
      this.currentLang = res;
      this.getAllWishlist()
    },
    error: (err: HttpErrorResponse) => {
      console.log(err);
    },
  });
  }
  isArabic(): boolean {
    return this.translate.currentLang === 'ar';
  }

  addToWhishlist(id: number): void {
    this.loading = true;
    this.formData.append('product_id', id.toString());
    console.log(this.formData);

    this._WishlistService.addWishlist(this.formData).subscribe({
      next: (res) => {
        console.log(res , 'look');
        if (res.message == 'Removed From Wishlist' && this.currentLang == 'en') {
          this._ToastrService.error(res.message);
          const toaster:any = document.querySelector(".overlay-container")
          toaster.style.direction = 'ltr'
        }
        else if(res.message == 'Removed From Wishlist' && this.currentLang == 'ar'){
          this._ToastrService.error('تم إزالة المنتج من قائمة المفضله');
          const toaster:any = document.querySelector(".overlay-container")
          toaster.style.direction = 'rtl'
        }
        this.allProducts = res.data;
        this.loading = false;
        this._WishlistService.wishlistNumber.next(this.allProducts.length);
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      },
    });
  }

  getAllWishlist(): void {
    this.loading = true;
    this._WishlistService
      .getWishlist(this.currency, this.userId.user_id, this.currentLang)
      .subscribe({
        next: (res) => {
          console.log(res, 'ddddddddddd');

          this.allProducts = res;
          this.wishlistData = res.map((item: any) => item.product.id);
          this.render = true;
          this.loading = false;
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
          this.render = true;
        },
      });
  }
  decodeToken(): void {
    this.userId=this._AuthService.userInfo;
  }
}
