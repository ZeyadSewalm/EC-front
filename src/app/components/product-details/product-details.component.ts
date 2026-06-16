import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { GalleriaModule } from 'primeng/galleria';
import { Details } from 'src/app/shared/interfaces/details';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CartService } from 'src/app/shared/services/cart.service';
import { ProductsService } from 'src/app/shared/services/products.service';
import { ToastrService } from 'ngx-toastr';
import { WishlistService } from 'src/app/shared/services/wishlist.service';
import { Wishlist } from 'src/app/shared/interfaces/wishlist';
import { RatingModule } from 'primeng/rating';
import { Review } from 'src/app/shared/interfaces/review';
import { ReviewCount } from 'src/app/shared/interfaces/reviewcount';
import { ReviewPrecentagePipe } from 'src/app/shared/pipes/review-precentage.pipe';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { CommonService } from 'src/app/shared/services/common.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LoadingComponent } from '../loading/loading.component';
import { combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CommonModule,
    DropdownModule,
    GalleriaModule,
    RatingModule,
    FormsModule,
    ReactiveFormsModule,
    ReviewPrecentagePipe,
    RouterLink,
    LazyLoadImageModule,
    TranslateModule,
    LoadingComponent,
  ],
  templateUrl: './product-details.component.html',
  styles: [
    `
      :host ::ng-deep .p-galleria-item-wrapper {
        background-color: #efeeea !important;
        padding: 20px;
      }

      :host ::ng-deep .p-galleria-thumbnail-container {
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
      }
    `,
  ],
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
  productDetails: Details = {} as Details;
  images: any[] = [];
  userId: string = '';
  itemsCartCount: number = 0;
  idOfUser: any;
  formData = new FormData();
  wishlistData: Wishlist[] = [];
  responsiveOptions: any[] | undefined;
  ratingCount: any;
  currency: any;
  allReviews: Review[] = [];
  reviewsCount: ReviewCount = {} as ReviewCount;
  loading: boolean = true;
  currentLang: string = '';
  slug: any;

  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _ProductsService: ProductsService,
    private _CartService: CartService,
    private _FormBuilder: FormBuilder,
    private _AuthService: AuthService,
    private _ToastrService: ToastrService,
    private _WishlistService: WishlistService,
    private _Renderer2: Renderer2,
    private _Router: Router,
    private _CommonService: CommonService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe({
      next: (params) => {
        this.slug = params.get('slug');
        this.getProductDetails()
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      },
    });

    this.responsiveOptions = [
      {
        breakpoint: '1400px',
        numVisible: 2,
      },
      {
        breakpoint: '1000px',
        numVisible: 1,
      },
    ];

    // wishlist
    this.decodeToken();
    if (this.idOfUser !== 'notLogin') {
      this.formData.append('user_id', this.idOfUser.user_id.toString());
      this._WishlistService
        .getWishlist('EGP', this.idOfUser.user_id, this.currentLang)
        .subscribe({
          next: (res) => {
            this.wishlistData = res.map((item: any) => item.product.id);
            console.log(this.wishlistData);
          },
          error: (err: HttpErrorResponse) => {
            console.log(err);
          },
        });
    } else {
      console.log('visitor');
    }
  }

  getProductDetails(): void {
    this.loading = true;
    this._ProductsService
      .getProductDetails(this.currency, this.slug, this.currentLang)
      .subscribe({
        next: (res) => {
          this.productDetails = res;
          this.ratingCount = this.productDetails?.product_rating?.toFixed(1);
          console.log(this.productDetails);
          this.images = this.productDetails?.gallery;
          this.images.unshift({ image: this.productDetails?.image });
          this.getAllReviews();
          this.loading = false;
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
        },
      });
  }

  decodeToken(): void {
    this.idOfUser=this._AuthService.userInfo;
  }
  // add to cart func
  addToCart(
    productId: number,
    Price: string,
    shipping: string,
    size: string,
    color: string,
    layer: HTMLDivElement
  ) {
    this._AuthService.decodeToken();
    if (this._AuthService.userInfo == 'notLogin') {
      this._Renderer2.removeClass(layer, 'd-none');
    } else {
      const userId: number = this._AuthService.userInfo.user_id;
      console.log(userId);

      let userCountry: string = '';

      this._CartService.getUserCountry().subscribe({
        next: (res) => {
          userCountry = res;
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
        },
      });

      const itemData: FormGroup = this._FormBuilder.group({
        product_id: productId,
        user_id: userId,
        qty: 1,
        price: Price,
        shipping_amount: shipping,
        country: userCountry,
        size: size,
        color: color,
        cart_id: userId,
        currency: 'EGP',
      });

      Object.keys(itemData.value).forEach((key) => {
        this.formData.append(key, itemData.get(key)?.value);
      });
      this._CartService.addToCart(this.formData).subscribe({
        next: (response) => {
          this._CartService
            .getUserCart(userId, userId, this.currentLang)
            .subscribe({
              next: (response) => {
                this.itemsCartCount = response.length;
                console.log(response.length);
                this._CartService.cartItemsNumber.next(this.itemsCartCount);
              },
              error: (err: HttpErrorResponse) => {
                console.log(err);
              },
            });
          this._ToastrService.success('Added To Cart');
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
        },
      });
    }
  }

  addAndRemoveWhishlist(id: number, layer: HTMLDivElement): void {
    this._AuthService.decodeToken();
    if (this._AuthService.userInfo == 'notLogin') {
      this._Renderer2.removeClass(layer, 'd-none');
    } else {
      this.formData.append('product_id', id.toString());
      this._WishlistService.addWishlist(this.formData).subscribe({
        next: (res) => {
          if (res.message == 'Added To Wishlist' && this.currentLang == 'en') {
            this._ToastrService.success('Added To Wishlist');
            const toaster: any = document.querySelector('.overlay-container');
            toaster.style.direction = 'ltr';
          } else if (
            res.message == 'Added To Wishlist' &&
            this.currentLang == 'ar'
          ) {
            this._ToastrService.success('تمت الإضافه في قائمة المفضله');
            const toaster: any = document.querySelector('.overlay-container');
            toaster.style.direction = 'rtl';
          } else if (
            res.message == 'Removed From Wishlist' &&
            this.currentLang == 'en'
          ) {
            this._ToastrService.error('Removed From Wishlist');
            const toaster: any = document.querySelector('.overlay-container');
            toaster.style.direction = 'ltr';
          } else if (
            res.message == 'Removed From Wishlist' &&
            this.currentLang == 'ar'
          ) {
            this._ToastrService.error('تمت الإزاله من قائمة المفضله');
            const toaster: any = document.querySelector('.overlay-container');
            toaster.style.direction = 'rtl';
          }
          this.wishlistData = res.wishlist;
          this._WishlistService.wishlistNumber.next(this.wishlistData.length);
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
        },
      });
    }
  }

  // review
  reviewForm: FormGroup = this._FormBuilder.group({
    rating: ['', [Validators.required]],
    review: ['', [Validators.required]],
  });

  handleReview() {
    if (this._AuthService.userInfo === 'notLogin') {
    this._AuthService.setRedirectUrl(this._Router.url);
    this._Router.navigate(['/login']);
    return;
  }
    this.loading = true;
    if (this.reviewForm.valid) {
      const formData = new FormData();
      formData.append('user_id', this.idOfUser.user_id.toString());
      formData.append('product_id', this.productDetails.id.toString());
      Object.keys(this.reviewForm.value).forEach((key) => {
        formData.append(key, this.reviewForm.get(key)?.value);
      });

      this._ProductsService.AddReview(formData).subscribe({
        next: (res) => {
          this._ToastrService.success(res.message);
          this.getProductDetails();
          this.reviewForm.reset();
          this.loading = false;
        },
        error: (err) => {
          console.log(err);
        },
      });
    } else {
      this.reviewForm.markAllAsTouched();
      this._ToastrService.warning('Must Add Review');
      this.loading = false;
    }
  }

  countreviews: number = 0;
  getAllReviews(): void {
    console.log('id', this.productDetails.id);
    this._ProductsService.getReview(this.productDetails.id).subscribe({
      next: (res) => {
        console.log(res.summary);

        this.allReviews = res.reviews;
        this.reviewsCount = res.summary;
        this.countreviews +=
          this.reviewsCount.five_star +
          this.reviewsCount.four_star +
          this.reviewsCount.three_star +
          this.reviewsCount.two_star +
          this.reviewsCount.one_star;
        console.log(this.countreviews);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  closeLayer(layer: HTMLDivElement) {
    this._Renderer2.addClass(layer, 'd-none');
  }

  isArabic(): boolean {
    return this.translate.currentLang === 'ar';
  }

  @ViewChild('img') mainImg!: ElementRef;
  active(e: any) {
    const imgSrc: string = e.target.src;
    this.mainImg.nativeElement.src = imgSrc;
  }
}
