import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerDashboardService {
  private baseUrl = environment.baseURL;

  constructor(private _HttpClient:HttpClient) { }
  userOrdersCount:BehaviorSubject<number> = new BehaviorSubject(0)
  notificationsCount:BehaviorSubject<number> = new BehaviorSubject(0)

  orderList(userId:number):Observable<any>
  {
    return this._HttpClient.get(`${this.baseUrl}/v1/customer/orders/${userId}/`)
  }
  orderDetails(userId:number , orderId:string):Observable<any>
  {
    return this._HttpClient.get(`${this.baseUrl}/v1/customer/orders/${userId}/${orderId}/`)
  }
  allNotifications(userId:number):Observable<any>
  {
    return this._HttpClient.get(`${this.baseUrl}/v1/customer/notifications/${userId}/`)
  }
  notificationRead(userId:number , notificationId:number):Observable<any>
  {
    return this._HttpClient.get(`${this.baseUrl}/v1/customer/notifications/${userId}/${notificationId}/`)
  }
  getUserProfile(userId:number):Observable<any>
  {
    return this._HttpClient.get(`${this.baseUrl}/v1/user/profile/${userId}/`)
  }
  updateUserProfile(userId:number , userData:any):Observable<any>
  {
    return this._HttpClient.patch(`${this.baseUrl}/v1/user/profile/${userId}/` , userData)
  }

}
