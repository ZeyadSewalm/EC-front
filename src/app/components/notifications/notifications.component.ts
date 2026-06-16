import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerDashboardService } from 'src/app/shared/services/customer-dashboard.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Notification } from 'src/app/shared/interfaces/notification';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule,TranslateModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit{
  constructor(private _CustomerDashboardService:CustomerDashboardService , private _AuthService:AuthService,private translate:TranslateService){}
  userId:number = 0
  allNotifications:Notification[] = []
  render:boolean = false

  getAllNotifications(){
    this._CustomerDashboardService.allNotifications(this.userId).subscribe({
      next:(res)=>{
        console.log(res);
        this.allNotifications = res
        this._CustomerDashboardService.notificationsCount.next(this.allNotifications.length)
        this.render = true
      },
      error:(err)=>{
        console.log(err);
        this.render = true
      }
    })
  }
  ngOnInit(): void {
    this._AuthService.decodeToken()
    this.userId = this._AuthService.userInfo.user_id
    console.log(this.userId);

    this.getAllNotifications()
    
  }

  markAsRead(notificationId:number){
    this._CustomerDashboardService.notificationRead(this.userId , notificationId).subscribe({
      next:(res)=>{
        console.log(res);
        this.getAllNotifications()
      },
      error:(err)=>{
        console.log(err);
        
      }
    })
  }

  isArabic(): boolean {
    return this.translate.currentLang === 'ar';
  }
}
