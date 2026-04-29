import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';

import { UserService } from '../stock/services/user.service';
import { ToastService } from '../stock/services/toast.service';
import { AuthService } from '../stock/services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { LoadingService } from '../stock/services/loading.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatIconModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  errorMessage = '';
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private toastService: ToastService,
    private authService: AuthService,
    private loadingService: LoadingService,
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.authService.logout();
  }

  onLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched(); //ép all input thành đã chạm
      this.toastService.show('Username và Password là bắt buộc', 'error');
      return;
    }

    const { username, password } = this.loginForm.value; //lấy gtri mà ngdung nhập vào từ form

    this.loadingService.show(); // thêm
    this.userService.login(username!, password!).subscribe({
      next: (response) => {
        this.loadingService.hide();
        this.authService.login(username);
        this.router.navigate(['/stocks/list']).then(() => {
          this.toastService.show(`Đăng nhập thành công! Chào ${username}`, 'success');
        });
      },
      error: (err) => {
        this.loadingService.hide();
        if (err.status === 0) {
          this.toastService.show('Lỗi kết nối server', 'error');
        } else {
          const msg = err.error?.message || 'Sai username hoặc password!';
          this.toastService.show(msg, 'error');
        }
      },
    });

    // this.userService.login(username!, password!).subscribe({
    //   next: (user) => {
    //     if (user) {
    //       this.authService.login(username);
    //       this.router.navigate(['/stocks/list']).then(() => {
    //         this.toastService.show(`Đăng nhập thành công! Chào ${username}`, 'success');
    //       });
    //     } else {
    //       this.toastService.show('Sai username hoặc password!', 'error');
    //     }
    //   },
    //   error: () => {
    //     this.toastService.show('Lỗi kết nối server', 'error');
    //   },
    // });
  }

  get username() {
    return this.loginForm.get('username');
  }
  get password() {
    return this.loginForm.get('password');
  }
}
