import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorNotificationsService } from 'src/app/shared/services/vendor-notifications.service';
import { VendorNotiCount } from 'src/app/shared/interfaces/vendor-noti-count';
import { VendorUnreadNoti } from 'src/app/shared/interfaces/vendor-unread-noti';
import { AuthService } from 'src/app/shared/services/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LoadingComponent } from 'src/app/components/loading/loading.component';

@Component({
  selector: 'app-vendor-notifications',
  standalone: true,
  imports: [CommonModule, TranslateModule, LoadingComponent],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  constructor(
    private _VendorNotificationsService: VendorNotificationsService,
    private _Renderer2: Renderer2,
    private _AuthService: AuthService,
    private translate: TranslateService
  ) {}
  vendorNotificationsCount: VendorNotiCount = {} as VendorNotiCount;
  vendorUnreadNotifications: VendorUnreadNoti[] = [];
  vendorReadNotifications: VendorUnreadNoti[] = [];
  vendorId: number = 0;
  loading: boolean = true;
  getAllNotifications() {
    this.loading = true;
    this._VendorNotificationsService
      .getAllNotifivationsCount(this.vendorId)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.vendorNotificationsCount = res[0];
          this.loading = false;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  // get unRead Noti
  getUnreadNotifications() {
    this.loading = true;
    this._VendorNotificationsService
      .getUnreadNotifivations(this.vendorId)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.vendorUnreadNotifications = res;
          this.loading = false;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  // get Read Noti
  getReadNotifications() {
    this._VendorNotificationsService
      .getAllReadNotifivations(this.vendorId)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.vendorReadNotifications = res;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  ngOnInit(): void {
    this._AuthService.decodeToken();
    this.vendorId = this._AuthService.userInfo.vendor_id;
    this.getAllNotifications();
    this.getUnreadNotifications();
  }

  closeLayer(layer: HTMLDivElement) {
    this._Renderer2.addClass(layer, 'd-none');
  }

  viewAllReadNoti(layer: HTMLDivElement) {
    this._Renderer2.removeClass(layer, 'd-none');
    this.getReadNotifications();
  }
  markAsRead(notifaicationId: number) {
    this.loading = true;
    this._VendorNotificationsService
      .markAsRead(this.vendorId, notifaicationId)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.getAllNotifications();
          this.getUnreadNotifications();
          this.loading = false;
        },
        error: (err) => {
          console.log(err);
          console.log(this._AuthService.userInfo);
        },
      });
  }

  isArabic(): boolean {
    return this.translate.currentLang === 'ar';
  }
}
