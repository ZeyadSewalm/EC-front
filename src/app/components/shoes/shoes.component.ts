import { RouterLink } from '@angular/router';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainsliderComponent } from '../mainslider/mainslider.component';
import { ProductsService } from 'src/app/shared/services/products.service';
import { HttpErrorResponse } from '@angular/common/http';
import { OwlOptions, CarouselModule } from 'ngx-owl-carousel-o';
import { Category } from 'src/app/shared/interfaces/category';
import { Brand } from 'src/app/shared/interfaces/brand';
import { WishlistService } from 'src/app/shared/services/wishlist.service';
import { jwtDecode } from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';
import { Wishlist } from 'src/app/shared/interfaces/wishlist';
import { AllProducts } from 'src/app/shared/interfaces/allproducts';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  LAZYLOAD_IMAGE_HOOKS,
  LazyLoadImageModule,
  ScrollHooks,
} from 'ng-lazyload-image';
import { CommonService } from 'src/app/shared/services/common.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BenefitsComponent } from '../benfits/benfits.component';
import { TestimonialsComponent } from '../testimonials/testimonials.component';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-shoes',
  standalone: true,
  imports: [
    CommonModule,
    MainsliderComponent,
    CarouselModule,
    RouterLink,
    ReactiveFormsModule,
    FormsModule,
    LazyLoadImageModule,
    TranslateModule,
    BenefitsComponent,
    TestimonialsComponent,
    LoadingComponent
  ],
  providers: [{ provide: LAZYLOAD_IMAGE_HOOKS, useClass: ScrollHooks }],
  templateUrl: './shoes.component.html',
  styleUrls: ['./shoes.component.scss'],
})
export class ShoesComponent implements OnInit {
  products: AllProducts[] = [];
  category: Category[] = [];
  brands: Brand[] = [];
  userId: any;
  formData = new FormData();
  wishlistData: Wishlist[] = [];
  currency: string = '';
  popularProduct: AllProducts[] = [];
  loadingCategory: boolean = true;
  loadingPopular: boolean = true;
  loadingBest: boolean = true;
  loadingbrand: boolean = true;
  loadingNew: boolean = true;
  newProduct: AllProducts[] = [];
  newProductSlider: OwlOptions = {
    rtl: false,
    // loop: true,
    margin: 15,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    // autoplay: true,
    autoplaySpeed: 1000,
    autoplayTimeout: 4000,
    navText: [
      '<i class="fas fa-chevron-left"></i>',
      '<i class="fas fa-chevron-right"></i>',
    ],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 3,
      },
      940: {
        items: 4,
      },
    },
    nav: true,
  };

  productSlider: OwlOptions = {
    rtl: false,
    // loop: true,
    margin: 15,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    // autoplay: true,
    autoplaySpeed: 1000,
    autoplayTimeout: 4000,
    navText: [
      '<i class="fas fa-chevron-left"></i>',
      '<i class="fas fa-chevron-right"></i>',
    ],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 3,
      },
      940: {
        items: 4,
      },
    },
    nav: true,
  };

  categorySlider: OwlOptions = {
    margin: 15,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    autoplay: true,
    autoplaySpeed: 1000,
    autoplayTimeout: 4000,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 3,
      },
      940: {
        items: 4,
      },
      1100: {
        items: 5,
      },
    },
    nav: false,
  };

  brandSlider: OwlOptions = {
    margin: 15,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    autoplay: true,
    autoplaySpeed: 1000,
    autoplayTimeout: 4000,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 3,
      },
      940: {
        items: 4,
      },
      1100: {
        items: 5,
      },
    },
    nav: false,
  };

  constructor(
    private _ProductsService: ProductsService,
    private _WishlistService: WishlistService,
    private _ToastrService: ToastrService,
    private _Renderer2: Renderer2,
    private _AuthService: AuthService,
    private _CommonService: CommonService,
    private translate: TranslateService
  ) {}

  paymentMethod: string = '';
  phone: string = '';
  currentLang: string = '';
  setPaymentMethod(method: any): void {
    this.paymentMethod = method.value;
  }

  onSubmit(): void {}

  ngOnInit(): void {
    this._CommonService.currency.subscribe({
      next: (res) => {
        this.currency = res.label;
        this.getBestProducts();
        this.getPopularProducts();
      },
    });
    this._CommonService.currentLang.subscribe({
      next: (res) => {
        console.log(res);
        this.currentLang = res;
        this.productSlider.rtl = this.isArabic();
        this.productSlider.navText = this.isArabic()
          ? [
              '<i class="fas fa-chevron-right"></i>',
              '<i class="fas fa-chevron-left"></i>',
            ]
          : [
              '<i class="fas fa-chevron-left"></i>',
              '<i class="fas fa-chevron-right"></i>',
            ];
        this.newProductSlider.rtl = this.isArabic();
        this.newProductSlider.navText = this.isArabic()
          ? [
              '<i class="fas fa-chevron-right"></i>',
              '<i class="fas fa-chevron-left"></i>',
            ]
          : [
              '<i class="fas fa-chevron-left"></i>',
              '<i class="fas fa-chevron-right"></i>',
            ];

        this.getAllCategory();
        this.getNewProducts();
        this.getPopularProducts();
        this.getBestProducts();
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      },
    });
    this.getAllBrands();
    this.decodeToken();
    if (this.userId !== 'notLogin') {
      this.formData.append('user_id', this.userId.user_id.toString());
      this._WishlistService
        .getWishlist(this.currency, this.userId.user_id , this.currentLang)
        .subscribe({
          next: (res) => {
            this.wishlistData = res.map((item: any) => item.product.id);
          },
          error: (err: HttpErrorResponse) => {
            console.log(err);
          },
        });
    } else {
      console.log('visitor');
    }
  }
  decodeToken(): void {
    this.userId=this._AuthService.userInfo;
  }
  getBestProducts(): void {
    this.loadingBest = true;
    this._ProductsService
      .getBestSeller(this.currency, this.currentLang)
      .subscribe({
        next: (res) => {
          this.products = res;
          this.loadingBest = false;
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
        },
      });
  }

  getPopularProducts(): void {
    this.loadingPopular = true;
    this._ProductsService
      .getPopularProduct(this.currency, this.currentLang)
      .subscribe({
        next: (res) => {
          this.popularProduct = res;
          this.loadingPopular = false;
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
        },
      });
  }

  getNewProducts(): void {
    this.loadingNew = true;
    this._ProductsService
      .getNewProduct(this.currentLang)
      .subscribe({
        next: (res) => {
          this.newProduct = res;
          this.loadingNew = false;
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
        },
      });
  }
  getAllCategory(): void {
    this.loadingCategory = true;
    this._ProductsService.getAllCategory(this.currentLang).subscribe({
      next: (res) => {
        this.category = res;
        this.loadingCategory = false;
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      },
    });
  }

  getAllBrands(): void {
    this.loadingbrand = true;
    this._ProductsService.getAllBrands(this.currentLang).subscribe({
      next: (res) => {
        this.brands = res;
        this.loadingbrand = false;
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      },
    });
  }

  addAndRemoveWhishlist(id: number, layer: HTMLDivElement): void {
    this._AuthService.decodeToken();
    if (this._AuthService.userInfo == 'notLogin') {
      this._Renderer2.removeClass(layer, 'd-none');
    } else {
      this.formData.append('product_id', id.toString());
      this._WishlistService.addWishlist(this.formData).subscribe({
        next: (res) => {
          console.log(res);

          if (res.message == 'Added To Wishlist' && this.currentLang == 'en') {
            this._ToastrService.success('Added To Wishlist');
            const toaster:any = document.querySelector(".overlay-container")
            toaster.style.direction = 'ltr'
          }
          else if(res.message == 'Added To Wishlist' && this.currentLang == 'ar'){
            this._ToastrService.success('تم إضافة المنتج في قائمة المفضله');
            const toaster:any = document.querySelector(".overlay-container")
            toaster.style.direction = 'rtl'
          }
          else if(res.message == 'Removed From Wishlist' && this.currentLang == 'en'){
            this._ToastrService.error('Removed From Wishlist');
            const toaster:any = document.querySelector(".overlay-container")
            toaster.style.direction = 'ltr'
          }
          else if(res.message == 'Removed From Wishlist' && this.currentLang == 'ar'){
            this._ToastrService.error('تم إزالة المنتج من قائمة المفضله');
            const toaster:any = document.querySelector(".overlay-container")
            toaster.style.direction = 'rtl'
          }
          console.log(res.message , "toaster");

          this.wishlistData = res.wishlist;
          this._WishlistService.wishlistNumber.next(this.wishlistData.length);
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
        },
      });
    }
  }

  // close layerLogin

  closeLayer(layer: HTMLDivElement) {
    this._Renderer2.addClass(layer, 'd-none');
  }
  isArabic(): boolean {
    return this.translate.currentLang === 'ar';
  }
}
