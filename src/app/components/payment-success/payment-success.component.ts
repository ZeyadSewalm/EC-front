import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PaymentService } from 'src/app/shared/services/payment.service';
import { CartService } from 'src/app/shared/services/cart.service';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.scss']
})
export class PaymentSuccessComponent implements OnInit{
  constructor(private _ActivatedRoute:ActivatedRoute , private _PaymentService:PaymentService , private _CartService:CartService){}
  sessionId:string = ''
  orderId:any = ''
  PaidMsgSuccess:string = ''
  PaidMsgFail:string = ''
  ngOnInit(): void {
    this._ActivatedRoute.queryParams.subscribe({
      next:(param)=>{
        console.log(param['session_id']);
        this.sessionId = param['session_id']
      },
      error:(err)=>{
        console.log(err);
      }
    })
    this._ActivatedRoute.paramMap.subscribe({
      next:(param)=>{
        console.log(param.get('id'));
        this.orderId = param.get('id')
      },
      error:(err)=>{
        console.log(err);
      }
    })

    const orderData:any = {
      order_oid:this.orderId,
      session_id:this.sessionId
    }

    this._PaymentService.paymentSuccess(this.orderId).subscribe({
      next:(res)=>{
        console.log(res);
        if (res.message == 'Paid' || res.message == 'Payment Successfull') {
          this.PaidMsgSuccess = res.message
          this._CartService.cartItemsNumber.next(0)
        }
        else {
          this.PaidMsgFail = res.message
        }

      },
      error:(err)=>{
        console.log(err);

      }
    })

  }
}
