import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.baseURL;
  // private accessToken: string | null = null;
  public userInfo: any;

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('accessToken');
    if (token) {
      this.setAccessToken(token);
    } else {
      this.userInfo = 'notLogin';
    }
  }

  decodeToken(): void {
    const token = this.getAccessToken();
    if (token) {
      try {
        const decoded = jwtDecode(token);
        this.userInfo = decoded;
      } catch (e) {
        this.userInfo = 'notLogin';
        console.error('Failed to decode access token:', e);
        // this.accessToken = null;
        localStorage.removeItem('accessToken');
      }
    } else {
      this.userInfo = 'notLogin';
    }
    // console.log('userInfo', this.userInfo);
  }

  login(formData: FormData, lang: string): Observable<any> {
    return this.http
      .post<any>(`${this.baseUrl}/v1/user/login/`, formData, {
        headers: { 'Accept-Language': lang },
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          if (response.access) {
            this.setAccessToken(response.access);
          }
        })
      );
  }

  refreshAccessToken(): Observable<any> {
    return this.http
      .post<any>(
        `${this.baseUrl}/v1/user/token/refresh/`,
        {},
        { withCredentials: true }
      )
      .pipe(
        tap((response) => {
          if (response.access) {
            this.setAccessToken(response.access);
          } else {
            this.logout();
          }
        }),
        catchError((err) => {
          this.logout();
          return throwError(() => err);
        })
      );
  }

  register(formData: FormData, lang: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/v1/user/register/`, formData, {
      headers: {
        'Accept-Language': lang,
      },
    });
  }

  setAccessToken(token: string): void {
    // this.accessToken = token;
    localStorage.setItem('accessToken', token);
    this.decodeToken();
  }

  getAccessToken(): string | null {
    // return this.accessToken;
    return localStorage.getItem('accessToken');
  }

  isAccessTokenExpired(): boolean {
    const token = this.getAccessToken();
    if (!token) {
      return true;
    }
    try {
      const decoded: any = jwtDecode(token);
      const exp = decoded.exp * 1000;
      return Date.now() > exp;
    } catch {
      return true;
    }
  }

  logout(): void {
    const csrfToken = this.getCookie('csrftoken');

    if (csrfToken) {
      this.http
        .post(
          `${this.baseUrl}/v1/user/logout/`,
          {},
          {
            withCredentials: true,
            headers: new HttpHeaders({
              'X-CSRFToken': csrfToken,
            }),
          }
        )
        .subscribe({
          next: () => {
            localStorage.removeItem('accessToken');
            this.userInfo = 'notLogin';
          },
          error: (err) => {
            localStorage.removeItem('accessToken');
            this.userInfo = 'notLogin';
          },
        });
    } else {
      console.error('CSRF Token is missing');
    }
  }

  getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() ?? '';
    return null;
  }

  private redirectUrl: string | null = null;

  setRedirectUrl(url: string) {
    this.redirectUrl = url;
  }

  getRedirectUrl(): string | null {
    return this.redirectUrl;
  }

  clearRedirectUrl() {
    this.redirectUrl = null;
  }
}
