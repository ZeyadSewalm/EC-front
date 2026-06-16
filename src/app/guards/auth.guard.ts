import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../shared/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.getAccessToken()) {
      return true;
    }

    // 2- مفيش accessToken -> جرب refresh
    return this.authService.refreshAccessToken().pipe(
      map((res: any) => {
        this.authService.setAccessToken(res.access);
        return true;
      }),
      catchError(() => {
        this.router.navigate(['/login']);
        return [false];
      })
    );
  }
}
