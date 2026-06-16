import { Component, HostListener, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from 'src/app/shared/services/cart.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { WishlistService } from 'src/app/shared/services/wishlist.service';
import { jwtDecode } from 'jwt-decode';
import { Decodetoken } from 'src/app/shared/interfaces/decodetoken';
import { Category } from 'src/app/shared/interfaces/products';
import { ProductsService } from 'src/app/shared/services/products.service';
import { FormsModule } from '@angular/forms';
import { AllProducts } from 'src/app/shared/interfaces/allproducts';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonService } from 'src/app/shared/services/common.service';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-blanknav',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    FormsModule,
    TranslateModule,
    LoadingComponent
  ],
  templateUrl: './blanknav.component.html',
  styleUrls: ['./blanknav.component.scss'],
})
export class BlanknavComponent implements OnInit {
  constructor(
    private router: Router,
    private _CartService: CartService,
    private _AuthService: AuthService,
    private _WishlistService: WishlistService,
    private _ProductsService: ProductsService,
    private _Router: Router,
    private translate: TranslateService,
    private _CommonService: CommonService
  ) {}

  reloadComponent(): void {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['products']);
    });
  }

  itemsCartCount: number = 0;
  itemsWishlistCount: number = 0;
  userId: number = 0;
  idOfUser: Decodetoken = {} as Decodetoken;
  category: Category[] = [];
  userLogedIn: boolean = false;
  vendorId: number = 0;
  currency: string = '';
  searchLoading: boolean = true;
  currentLang: string = '';
  changeCurrentLang(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('currentLang', lang);
    this._CommonService.currentLang.next(lang);
    this._CommonService.currentLang.subscribe({
      next: (res) => {
        console.log(res);
        this.currentLang = res;
        this.getAllCategory();
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      },
    });
  }
  selectedLanguage: string = '';
  ngOnInit(): void {
    this.currentLang = localStorage.getItem('currentLang') || 'en';
    this.translate.use(this.currentLang);
    this._CommonService.currentLang.next(this.currentLang);
    this._CommonService.currency.subscribe({
      next: (res) => {
        this.currency = res.label;
        console.log(this.currency);
      },
    });
    if (JSON.parse(localStorage.getItem('currencyFlag')!) !== null) {
      this.selectedCurrencyFlag = JSON.parse(
        localStorage.getItem('currencyFlag')!
      );
      this._CommonService.currency.next(this.selectedCurrencyFlag);
      console.log(this.selectedCurrencyFlag, '555555555555');
    } else {
      this.selectedCurrencyFlag = { label: 'EGP', icon: 'fi-eg' };
      this._CommonService.currency.next(this.selectedCurrencyFlag);
    }

    if (localStorage.getItem('currency')) {
      this.selectedCurrencyFlag = JSON.parse(localStorage.getItem('currency')!);
      console.log(this.selectedCurrencyFlag);
    }

    if (this._AuthService.userInfo !== 'notLogin') {
      this.userLogedIn = true;
      this.userId = this._AuthService.userInfo?.user_id;
      this.vendorId = this._AuthService.userInfo?.vendor_id;
      this._CartService.getUserCart(this.userId, this.userId , this.currentLang).subscribe({
        next: (response) => {
          this.itemsCartCount = response.length;
          console.log(response.length);
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
        },
      });

      this._CartService.cartItemsNumber.subscribe({
        next: (response) => {
          this.itemsCartCount = response;
          console.log(response);
        },
        error: (err) => {},
      });

      this._WishlistService.wishlistNumber.subscribe({
        next: (res) => {
          this.itemsWishlistCount = res;
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
        },
      });

      this.decodeToken();

      this._WishlistService
        .getWishlist(this.selectedCurrencyFlag.label, this.idOfUser.user_id , this.currentLang)
        .subscribe({
          next: (res) => {
            const newData = res.map((item: any) => item.product.id);
            console.log('len', newData.length);

            this._WishlistService.wishlistNumber.next(newData.length);
          },
          error: (err: HttpErrorResponse) => {
            console.log(err);
          },
        });

      this.getAllCategory();
    } else {
      console.log('visitor');
      this.getAllCategory();
      this.userLogedIn = false;
    }
    this.selectedLanguage =
      localStorage.getItem('selectedLanguage') || 'English';
  }
  getAllCategory(): void {
    this._ProductsService.getAllCategory(this.currentLang).subscribe({
      next: (res) => {
        this.category = res;
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      },
    });
  }
  decodeToken(): void {
    this.idOfUser=this._AuthService.userInfo;
  }

  // dropdown
  isDropdownOpenFlag: boolean = false;
  selectedCurrencyFlag: any;
  currencies__flag = [
    { label: 'EGP', icon: 'fi-eg' },
    { label: 'AED', icon: 'fi-ae' },
  ];

  toggleDropdownFlag() {
    this.isDropdownOpenFlag = !this.isDropdownOpenFlag;
  }

  selectCurrencyFlag(currency: any) {
    localStorage.setItem('currencyFlag', JSON.stringify(currency));
    this.selectedCurrencyFlag = currency;
    localStorage.setItem('currency', JSON.stringify(currency));
    this.isDropdownOpenFlag = false;
    this.selectedCurrencyFlag = currency;
    this._CommonService.currency.next(currency);
  }

  logOut() {
    this._AuthService.logout();
    this._Router.navigate(['/login']);
  }

  search: string = '';
  searchProduct: AllProducts[] = [];
  getAllProduct(): void {
    this.searchLoading = true;
    if (this.search.length >= 3) {
      this._ProductsService
        .getAllProduct(this.search, [], [], [], 0, 1, 'EGP',this.currentLang)
        .subscribe({
          next: (res) => {
            console.log(res);
            this.searchLoading = false;
            this.searchProduct = res.results;
          },
          error: (err) => {
            console.log(err);
          },
        });
    }
  }
  routing(item: any) {
    this._Router.navigate(['/product/details', item.slug]);
    this.search = '';
  }

  selectLanguage(language: string) {
    this.selectedLanguage = language;
    localStorage.setItem('selectedLanguage', this.selectedLanguage);
  }

  getIconClass(language: string) {
    switch (language) {
      case 'English':
        return 'fi fi-gb-eng';
      case 'Arabic':
        return 'fi fi-eg';
      default:
        return '';
    }
  }
  isArabic(): boolean {
    return this.translate.currentLang === 'ar';
  }
}
