import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastService } from '../stock/services/toast.service';
import { AuthService } from '../stock/services/auth.service';
//ktra quyền truy cập
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); //lấy các service cần use
  const toastService = inject(ToastService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }
  toastService.show('Bạn cần đăng nhập/ đăng ký để thực hiện hành động này!', 'error');

  router.navigate(['/login']);
  return false;
};
