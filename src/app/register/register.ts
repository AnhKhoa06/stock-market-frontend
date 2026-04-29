import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { UserService } from '../stock/services/user.service';
import { ToastService } from '../stock/services/toast.service';
import { AuthService } from '../stock/services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { LoadingService } from '../stock/services/loading.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatIconModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerForm!: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private toastService: ToastService,
    private authService: AuthService,
    private loadingService: LoadingService,
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.authService.logout();
  }

  onRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.toastService.show('Vui lòng nhập đầy đủ thông tin', 'error');
      return;
    }

    const { username, password, confirmPassword } = this.registerForm.value; //laydltuf

    if (password !== confirmPassword) {
      this.toastService.show('Mật khẩu xác nhận không khớp', 'error');
      return;
    }

    const newUser = { username, password }; //tạo 1 object newuser chứa .. để chuẩn hóa dl trc khi gửi

    this.loadingService.show(); // thêm
    this.userService.register(newUser).subscribe({
      next: () => {
        this.loadingService.hide();
        this.router.navigate(['/login']).then(() => {
          this.toastService.show('Đăng ký thành công! Bạn có thể đăng nhập ngay.', 'success');
        });
      },
      error: (err) => {
        this.loadingService.hide();
        const msg = err.error?.message || 'Lỗi khi đăng ký. Vui lòng thử lại.';
        this.toastService.show(msg, 'error');
      },
    });
  }

  get username() {
    return this.registerForm.get('username');
  }
  get password() {
    return this.registerForm.get('password');
  }
  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }
}
