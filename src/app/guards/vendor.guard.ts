import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AuthService } from '../shared/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class VendorAuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> | boolean {
    // If user info exists and has vendor_id, allow access
    if (this.authService.userInfo && this.authService.userInfo !== 'notLogin') {
      if (this.authService.userInfo.vendor_id!=0) {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    }

    // No userInfo or not logged in -> try refresh token
    return this.authService.refreshAccessToken().pipe(
      map((res: any) => {
        this.authService.setAccessToken(res.access);
        this.authService.decodeToken();
        if (this.authService.userInfo && this.authService.userInfo.vendor_id) {
          return true;
        } else {
          this.router.navigate(['/login']);
          return false;
        }
      }),
      catchError(() => {
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}
