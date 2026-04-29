import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, NavigationEnd } from '@angular/router';
import { ToastComponent } from './toast/toast';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from './stock/services/auth.service';
import { LoadingComponent } from './loading/loading';
import { CommonModule } from '@angular/common';
import { LoadingService } from './stock/services/loading.service';
import { ToastService } from './stock/services/toast.service';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    ToastComponent,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatTooltipModule,
    LoadingComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  sidenavOpened = signal(true);
  isAuthPage = signal(true); // Mặc định là trang Login/Register

  navItems = [
    { label: 'Profile', icon: 'person', route: '/profile' },
    { label: 'Stock List', icon: 'list_alt', route: '/stocks/list' },
    { label: 'Create Stock', icon: 'add_circle', route: '/stocks/create' },
    { label: 'Favorite Stocks', icon: 'favorite', route: '/stocks/favorite' },
  ];

  showLogoutDialog = signal(false);

  constructor(
    private router: Router,
    private authService: AuthService,
    private loadingService: LoadingService,
    private toastService: ToastService,
  ) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;
        // Chỉ ẩn header + sidenav khi đang ở trang Login hoặc Register
        this.isAuthPage.set(url === '/login' || url === '/register');
      }
    });
  }

  toggleSidenav() {
    this.sidenavOpened.update((v) => !v);
  }

  openLogoutDialog() {
    this.showLogoutDialog.set(true);
  }

  cancelLogout() {
    this.showLogoutDialog.set(false);
  }

  logout() {
    this.showLogoutDialog.set(false);
    this.loadingService.show();
    setTimeout(() => {
      this.authService.logout();
      this.loadingService.hide();
      this.router.navigate(['/login']).then(() => {
        this.toastService.show('Đăng xuất thành công!', 'success');
      });
    }, 1000);
  }
}
