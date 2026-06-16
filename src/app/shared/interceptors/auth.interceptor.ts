import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private publicUrls = [
    '/v1/user/login/',
    '/v1/user/register/',
    '/v1/user/token/refresh/',
    '/v1/user/password-reset/',
    '/v1/user/csr/',
    '/v1/productss/',
    '/v1/category/',
    '/v1/brand/',
    '/v1/product/',
    '/v1/product/category/',
    '/v1/product/brand/',
    '/v1/product-popular/',
    '/v1/product-bestseller/',
    '/v1/product-new/',
    '/v1/paymob/callback/',
    '/v1/shop/',
    '/assets/i18n/',
  ];

  private isRefreshing = false;

  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.publicUrls.some(url => req.url.includes(url)) || req.url.includes('token/refresh') || req.url.startsWith('/v1/product')||(req.method === 'GET' && req.url.includes('/v1/reviews/')) ) {
      return next.handle(req);
    }

    const accessToken = this.authService.getAccessToken();

    if (!accessToken) {
      return this.authService.refreshAccessToken().pipe(
        switchMap((newToken: any) => {
          const clonedReq = this.addToken(req, newToken.access);
          return next.handle(clonedReq);
        }),
        catchError(err => {
          this.router.navigate(['/login']);
          return throwError(() => err);
        })
      );
    }

    if (this.authService.isAccessTokenExpired()) {
      return this.authService.refreshAccessToken().pipe(
        switchMap((newToken: any) => {
          const clonedReq = this.addToken(req, newToken.access);
          return next.handle(clonedReq);
        }),
        catchError(err => {
          this.router.navigate(['/login']);
          return throwError(() => err);
        })
      );
    }

    const clonedReq = this.addToken(req, accessToken);
    return next.handle(clonedReq).pipe(
      catchError(error => this.handleError(req, next, error))
    );
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    });
  }

  private handleError(req: HttpRequest<any>, next: HttpHandler, error: any): Observable<HttpEvent<any>> {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 401 && !this.isRefreshing) {
        this.isRefreshing = true;
        return this.authService.refreshAccessToken().pipe(
          switchMap((newToken: any) => {
            this.isRefreshing = false;
            const clonedReq = this.addToken(req, newToken.access);
            return next.handle(clonedReq);
          }),
          catchError(refreshError => {
            this.isRefreshing = false;
            this.authService.logout();
            this.router.navigate(['/login']);
            return throwError(() => refreshError);
          })
        );
      }

      return throwError(() => error);
    }

    return throwError(() => error);
  }
}
