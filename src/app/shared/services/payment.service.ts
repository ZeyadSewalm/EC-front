import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private baseUrl = environment.baseURL;

  constructor(private _HttpClient:HttpClient) { }

  applyCopon(coponData:any):Observable<any>
  {
    return this._HttpClient.post(`${this.baseUrl}/v1/coupon/` , coponData)
  }

  paymentSuccess(orderId:string):Observable<any>
  {
    return this._HttpClient.get(`${this.baseUrl}/v1/paymob/check-payment/${orderId}/`)
  }
  paymentCash(orderId:string):Observable<any>
  {
    return this._HttpClient.post(`${this.baseUrl}/v1/cash-payment/${orderId}/`,{})
  }
}
