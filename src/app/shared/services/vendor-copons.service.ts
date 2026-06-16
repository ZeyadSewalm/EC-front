import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VendorCoponsService {
  private baseUrl = environment.baseURL;

  constructor(private _HttpClient:HttpClient) { }

  // coupons Status
  couponsStatus(vendorId:number):Observable<any>
  {
    return this._HttpClient.get(`${this.baseUrl}/v1/vendor-coupon-stats/${vendorId}/`)
  }

  // list coupons
  listCoupons(id:number):Observable<any>
  {
    return this._HttpClient.get(`${this.baseUrl}/v1/vendor-coupon-list/${id}/`)
  }

  // create coupon
  createCoupon(id:number,couponDetails:any):Observable<any>
  {
    return this._HttpClient.post(`${this.baseUrl}/v1/vendor-coupon-create/${id}/`,couponDetails)
  }

  // delete coupon
  deleteCoupon(vendorId:number,couponId:number):Observable<any>
  {
    return this._HttpClient.delete(`${this.baseUrl}/v1/vendor-coupon-detail/${vendorId}/${couponId}/`)
  }

  // copon details => for edit
  couponDetails(vendorId:number , couponId:number):Observable<any>
  {
    return this._HttpClient.get(`${this.baseUrl}/v1/vendor-coupon-detail/${vendorId}/${couponId}/`)
  }

  // update coupon
  updateCoupon(vendorId:number , couponId:number,couponDetails:any):Observable<any>
  {
    return this._HttpClient.patch(`${this.baseUrl}/v1/vendor-coupon-detail/${vendorId}/${couponId}/`,couponDetails)
  }
}
