import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CustomerDashboardService } from 'src/app/shared/services/customer-dashboard.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { WishlistService } from 'src/app/shared/services/wishlist.service';
import { ProductsService } from 'src/app/shared/services/products.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, TranslateModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  constructor(
    private _CustomerDashboardService: CustomerDashboardService,
    private _AuthService: AuthService,
    private _WishlistService: WishlistService,
    private _ProductsService: ProductsService,
    private _CommonService: CommonService,
    private translate:TranslateService
  ) {}
  ordersCount: number = 0;
  notificationsCount: number = 0;
  itemsWishlistCount: number = 0;
  userId: number = 0;
  userName: string = '';
  userImage: string = '';
  currentLang: string = '';
  currency: any;
  render: boolean = false;

  isArabic(): boolean {
    return this.translate.currentLang === 'ar';
  }
  getUserImage() {
    this._CustomerDashboardService.getUserProfile(this.userId).subscribe({
      next: (res) => {
        console.log('proData', res.image);
        this.userImage = res.image;
        this.render = true;
      },
      error: (err) => {
        console.log(err);
        this.render = true;
      },
    });
  }
  ngOnInit(): void {
    // get currecy value
    this._CommonService.currency.subscribe({
      next: (res) => {
        this.currency = res.label;
        console.log(this.currency);
      },
    });
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
    this._AuthService.decodeToken();
    this.userId = this._AuthService.userInfo.user_id;
    this.userName = this._AuthService.userInfo.full_name;
    console.log(this.userId);
    this._CustomerDashboardService.allNotifications(this.userId).subscribe({
      next: (res) => {
        console.log(res);
        this.notificationsCount = res.length;
      },
      error: (err) => {
        console.log(err);
      },
    });
    this._CustomerDashboardService.notificationsCount.subscribe({
      next: (res) => {
        this.notificationsCount = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
    this._CustomerDashboardService.orderList(this.userId).subscribe({
      next: (res) => {
        console.log(res , 'ordersCount');
        this.ordersCount = res.length;
      },
      error: (err) => {
        console.log(err);
      },
    });
    this._CustomerDashboardService.userOrdersCount.subscribe({
      next: (res) => {
        this.ordersCount = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
    this._WishlistService.getWishlist(this.currency, this.userId , this.currentLang).subscribe({
      next: (res) => {
        this.itemsWishlistCount = res.length;
        console.log('len', res);
      },
      error: (err) => {
        console.log(err);
      },
    });

    this._WishlistService.wishlistNumber.subscribe({
      next: (res) => {
        this.itemsWishlistCount = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.getUserImage();
  }
}
