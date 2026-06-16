import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CustomerDashboardService } from 'src/app/shared/services/customer-dashboard.service';
import { RouterLink } from '@angular/router';
import { OrderData } from 'src/app/shared/interfaces/order-data';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule , RouterLink , TranslateModule],

  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit{
  constructor(private _AuthService:AuthService , private _CustomerDashboardService:CustomerDashboardService , private translate:TranslateService){}
  userId:number = 0
  allOrders:OrderData[] = []
  pendingDelivery:OrderData[] = []
  fulfilledOrders:OrderData[] = []

  ngOnInit(): void {
    this._AuthService.decodeToken()
    this.userId = this._AuthService.userInfo.user_id
    console.log(this.userId ,"orders");

    this._CustomerDashboardService.orderList(this.userId).subscribe({
      next:(res)=>{
        console.log(res);
        this.allOrders = res
        for (const order of this.allOrders) {
          if (order.order_status == "Pending") {
            this.pendingDelivery.push(order)
          }
          else {
            this.fulfilledOrders.push(order)
          }
        }
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
