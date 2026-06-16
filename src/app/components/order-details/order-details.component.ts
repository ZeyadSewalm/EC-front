import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerDashboardService } from 'src/app/shared/services/customer-dashboard.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { OrderDetails } from 'src/app/shared/interfaces/order-details';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule,TranslateModule],
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit{
  constructor(private _CustomerDashboardService:CustomerDashboardService , private _CommonService:CommonService , private _AuthService:AuthService , private _ActivatedRoute:ActivatedRoute , private translate:TranslateService){}
  userId:number = 0
  orderId:any
  currency:string = ''
  orderDetails:OrderDetails = {} as OrderDetails
  render:boolean = false
  ngOnInit(): void {
    this._AuthService.decodeToken()
    this.userId = this._AuthService.userInfo.user_id
    console.log(this.userId);

    // orderID
    this._ActivatedRoute.paramMap.subscribe({
      next:(param)=>{
        console.log(param.get('id') , 'flag');
        this.orderId = param.get('id')
      },
      error:(err)=>{
        console.log(err);
        
      }
    })

    // currency
    this._CommonService.currency.subscribe({
      next: (res) => {
        this.currency = res.label;
        console.log(this.currency);
        this.getOrderDetails();
      },
    });

    

    

    
  }
  getOrderDetails(){
    this._CustomerDashboardService.orderDetails(this.userId , this.orderId).subscribe({
      
      next:(res)=>{
        console.log(res);
        this.orderDetails = res
        this.render = true
      },
      error:(err)=>{
        console.log(err);
        this.render = true
      }
      
    })
    console.log(this.orderId , 'opop');

  }
  calcTotal(price:string , qty:number){
    return  Number(price) * qty
  }
  isArabic(): boolean {
    return this.translate.currentLang === 'ar';
  }
}
