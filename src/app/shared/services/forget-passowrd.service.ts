import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ForgetPassowrdService {
  private baseUrl = environment.baseURL;
  constructor(private _HttpClient: HttpClient) {}

  passwordreset(email: FormData): Observable<any> {
    return this._HttpClient.post(
      `${this.baseUrl}/v1/user/password-reset/`,
      email,
    );
  }
  createPassword(form: FormData): Observable<any> {
    return this._HttpClient.post(
      `${this.baseUrl}/v1/user/password-change/`,
      form
    );
  }
}
