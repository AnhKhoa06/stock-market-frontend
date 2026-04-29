import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false); //tạo biến lưu tt login
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor() {
    // Khởi tạo từ localStorage để khi reload trang vẫn giữ tt login
    this.isLoggedInSubject.next(localStorage.getItem('isLoggedIn') === 'true');
  }

  login(username?: string) {
    localStorage.setItem('isLoggedIn', 'true');
    if (username) localStorage.setItem('username', username);
    this.isLoggedInSubject.next(true);
  }

  logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    this.isLoggedInSubject.next(false);
  }

  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  getUsername(): string {
    return localStorage.getItem('username') || 'Người dùng';
  }
}
