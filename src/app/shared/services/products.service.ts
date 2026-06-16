import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private baseUrl = environment.baseURL;
  constructor(
    private _HttpClient: HttpClient,
  ) {}
  getPopularProduct(currency: string,lang:string): Observable<any> {
    return this._HttpClient.get(
      `${this.baseUrl}/v1/product-popular/${currency}/`,
      {
        headers: {
          'Accept-Language':lang
        }
      }
    );
  }

  getNewProduct(lang:string): Observable<any> {
    return this._HttpClient.get(
      `${this.baseUrl}/v1/product-new/`,
      {
        headers: {
          'Accept-Language':lang
        }
      }
    );
  }

  getBestSeller(currency: string,lang:string): Observable<any> {
    return this._HttpClient.get(
      `${this.baseUrl}/v1/product-bestseller/${currency}/`,
      {
        headers: {
          'Accept-Language': lang,
        },
      }
    );
  }
  getProductDetails(currency: string, slug: string , lang:string): Observable<any> {
    return this._HttpClient.get(
      `${this.baseUrl}/v1/product/${currency}/${slug}/`,
      {
        headers:{
          'Accept-Language':lang
        }
      }
    );
  }
  getAllCategory(lang:string): Observable<any> {
    return this._HttpClient.get(
      `${this.baseUrl}/v1/category/`,
      {
        headers: {
          'Accept-Language':lang
        }
      }
    );
  }

  getAllProduct(
    title: string = '',
    category: any[] = [],
    rangePrice: number[] = [],
    selectedBrands: any[] = [],
    ratingValue: number = 0,
    page: number = 1,
    currency: string = '',
    lang:string
  ): Observable<any> {
    return this._HttpClient.get(
      `${this.baseUrl}/v1/productss/${currency}/?brand_ids=${selectedBrands}&category_ids=${category}&page=${page}&price=${rangePrice}&rating=${ratingValue}&title=${title}`,
      {
        headers: {
          'Accept-Language': lang,
        },
      }
    );
  }

  // get all brands

  getAllBrands(lang:string): Observable<any> {
    return this._HttpClient.get(
      `${this.baseUrl}/v1/brand/`,
      {
        headers: {
          'Accept-Language': lang,
        },
      }
    );
  }

  // review functions

  AddReview(data: FormData): Observable<any> {
    return this._HttpClient.post(
      `${this.baseUrl}/v1/reviews/`,
      data
    );
  }
  getReview(productId: number): Observable<any> {
    return this._HttpClient.get(
      `${this.baseUrl}/v1/reviews/${productId}/`
    );
  }
}
