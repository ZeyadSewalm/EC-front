import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const dashboardGuard: CanActivateFn = (route, state) => {
  let _Router: Router = inject(Router);
  let _AuthService: AuthService = inject(AuthService);
  let vendorId = 0;
  _AuthService.decodeToken();
  vendorId = _AuthService.userInfo.vendor_id;
  if (vendorId != 0) {
    return true;
  } else {
    _Router.navigate(['/home']);
    return false;
  }
};
