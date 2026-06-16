import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // URLs عامة مش محتاجة توكن
    const publicUrls = [
    '/user/login',
    '/user/register',
    '/user/password-reset',
    '/user/csr',
    '/productss',
    '/category',
    '/brand',
    '/product/',
    '/product/category/',
    '/product/brand/',
    '/product-popular',
    '/product-bestseller',
    '/product-new',
    '/paymob/callback',
    '/shop/',
    '/assets/i18n/'
  ];
    if (publicUrls.some(url => req.url.includes(url))) {
      return next.handle(req);
    }

    const accessToken = this.authService.getAccessToken();

    if (!accessToken || this.authService.isAccessTokenExpired()) {
      // لو التوكن منتهي جدد التوكن
      return from(this.authService.refreshAccessToken()).pipe(
        switchMap((newToken: string) => {
          const cloned = req.clone({
            setHeaders: { Authorization: `Bearer ${newToken}` }
          });
          return next.handle(cloned);
        })

      );
    }

    // لو التوكن سليم
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` }
    });
    return next.handle(cloned);
  }
}
