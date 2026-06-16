import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = environment.baseURL;

  constructor(private _HttpClient:HttpClient) { }

  cartItemsNumber:BehaviorSubject<number> = new BehaviorSubject(0)


  addToCart(formData:FormData):Observable<any>
  {
    return this._HttpClient.post(`${this.baseUrl}/v1/cart-view/` , formData)
  }

  getUserCart(cartId:number , userId:number , lang:string):Observable<any>
  {
    return this._HttpClient.get(`${this.baseUrl}/v1/cart-list/${cartId}/${userId}/` , {
      headers : {
        'Accept-Language' : lang
      }
    })
  }

  getCartTotalSummary(cartId:number , userId:number):Observable<any>
  {
    return this._HttpClient.get(`${this.baseUrl}/v1/cart-detail/${cartId}/${userId}/`)
  }

  updateCart(formData:FormData , lang:string):Observable<any>
  {
    return this._HttpClient.post(`${this.baseUrl}/v1/cart-view/` , formData , {
      headers : {
        'Accept-Language' : lang
      }
    })
  }

  removeItem(cartId:number , id:number , userId:number):Observable<any>
  {
    return this._HttpClient.delete(`${this.baseUrl}/v1/cart-delete/${cartId}/${id}/${userId}/`)
  }

  createOrder(formData:FormData):Observable<any>
  {
    return this._HttpClient.post(`${this.baseUrl}/v1/create-order/` , formData)
  }

  getOrderDetails(orderId:string):Observable<any>
  {
    return this._HttpClient.get(`${this.baseUrl}/v1/checkout/${orderId}/` )
  }

  getUserCountry(): Observable<string> {
    return this._HttpClient.get('https://ipapi.co/json/').pipe(
      map((response: any) => {
        return response.country_name;
      })
    );
  }
}
