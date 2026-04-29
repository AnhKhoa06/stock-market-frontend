import { Routes } from '@angular/router';

import { Login } from './login/login';
import { Register } from './register/register';
import { StockList } from './stock/stock-list/stock-list';
import { CreateStockReactive } from './stock/create-stock-reactive/create-stock-reactive';
import { StockDetails } from './stock/stock-details/stock-details';
import { Profile } from './profile/profile';
import { authGuard } from './guards/auth.guard';
import { Favorite } from './stock/favorite/favorite';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'profile', component: Profile, canActivate: [authGuard] },
  { path: 'stocks/list', component: StockList, canActivate: [authGuard] },
  { path: 'stocks/create', component: CreateStockReactive, canActivate: [authGuard] },
  { path: 'stocks/favorite', component: Favorite, canActivate: [authGuard] },
  { path: 'stocks/details/:id', component: StockDetails },
  { path: '**', redirectTo: '/login' },
];
