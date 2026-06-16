import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private baseUrl = environment.baseURL;
  wishlistNumber:BehaviorSubject<number> = new BehaviorSubject(0);
  constructor(private _HttpClient: HttpClient) {}

  addWishlist(data: FormData): Observable<any> {
    return this._HttpClient.post(
      `${this.baseUrl}/v1/customer/wishlist/create/`,
      data
    );
  }

  getWishlist(currency:string ,userID: number , lang:string): Observable<any> {
    return this._HttpClient.get(
      `${this.baseUrl}/v1/customer/wishlist/${currency}/${userID}/`,
      {
        headers: {
          'Accept-Language':lang
        }
      }
    );
  }
}
