import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private REST_API_SERVER = 'https://stock-market-backend-production-6d5f.up.railway.app/api';
  // private REST_API_SERVER = 'http://localhost:3000';

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private httpClient: HttpClient) {}

  // Đăng nhập
  login(username: string, password: string): Observable<any> {
    const loginData = { username, password };
    return this.httpClient.post(`${this.REST_API_SERVER}/Users/login`, loginData, this.httpOptions);
  }

  // login(username: string, password: string): Observable<any | null> {
  //   const url = `${this.REST_API_SERVER}/users`;
  //   return this.httpClient.get<any[]>(url).pipe(
  //     map((users) => {
  //       return users.find((u) => u.username === username && u.password === password) || null;
  //     }),
  //   );
  // }

  // Đăng ký
  register(user: any): Observable<any> {
    return this.httpClient.post(`${this.REST_API_SERVER}/Users/register`, user, this.httpOptions);
  }

  // register(user: any): Observable<any> {
  //   const url = `${this.REST_API_SERVER}/users`;
  //   return this.httpClient.post(url, user, this.httpOptions);
  // }
}
