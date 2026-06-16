import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VendorNotificationsService {
  private baseUrl = environment.baseURL;

  constructor(private _HttpClient:HttpClient ) { }

  getAllNotifivationsCount(vendorId:number):Observable<any>
  {
    return this._HttpClient.get(`${this.baseUrl}/v1/vendor-notifications-summary/${vendorId}/`)
  }
  getUnreadNotifivations(vendorId:number):Observable<any>
  {
    return this._HttpClient.get(`${this.baseUrl}/v1/vendor-notifications-unseen/${vendorId}/`)
  }
  getAllReadNotifivations(vendorId:number):Observable<any>
  {
    return this._HttpClient.get(`${this.baseUrl}/v1/vendor-notifications-seen/${vendorId}/`)
  }
  markAsRead(vendorId:number , notificationId:number):Observable<any>
  {
    return this._HttpClient.get(`${this.baseUrl}/v1/vendor-notifications-mark-as-seen/${vendorId}/${notificationId}/`)
  }
}
