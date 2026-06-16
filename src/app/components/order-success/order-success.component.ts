import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './order-success.component.html',
  styleUrls: ['./order-success.component.scss']
})
export class OrderSuccessComponent implements OnInit{
    constructor(private _ActivatedRoute:ActivatedRoute ){}


PaidMsgSuccess:string = ''
  status:any
  id:any = ''
  PaidMsgFail:string = ''

//   ngOnInit(): void {
//     this._ActivatedRoute.queryParams.subscribe({
//       next:(param)=>{
//         this.status = param['status']
//         this.id = param['id']
//         console.log(this.status , this.id);


//         if (this.status == 'success') {
//           this.PaidMsgSuccess = 'Order Confirmed!'
//         }
//         else if (this.status == 'fail') {
//           this.PaidMsgFail = 'Error , Not Paid!'
//         }
//       },
//       error:(err)=>{
//         console.log(err);
//       }
//     })


// }
ngOnInit(): void {
  this._ActivatedRoute.paramMap.subscribe({
    next: (param) => {
      this.status = param.get('status');
      this.id = param.get('id');
      console.log(this.status, this.id);

      if (this.status === 'success') {
        this.PaidMsgSuccess = 'Order Confirmed!';
      } else if (this.status === 'fail') {
        this.PaidMsgFail = 'Error, Not Paid!';
      }
    },
    error: (err) => {
      console.log(err);
    }
  });
}

}
