import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpServiceService {
  private REST_API_SERVER = 'https://stock-market-backend-production-6d5f.up.railway.app/api';
  // private REST_API_SERVER = 'http://localhost:3000';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private httpClient: HttpClient) {}

  public getStocks(): Observable<any> {
    const url = `${this.REST_API_SERVER}/stocks`;
    return this.httpClient.get<any>(url, this.httpOptions);
  }

  // Thêm hàm mới này
  public getStockById(id: number): Observable<any> {
    return this.httpClient.get<any>(`${this.REST_API_SERVER}/Stocks/${id}`, this.httpOptions);
  }

  public postStock(body: any): Observable<any> {
    const url = `${this.REST_API_SERVER}/stocks`;
    console.log('postStock =', url);
    console.log('postStock: body', body);
    return this.httpClient.post<any>(url, body, this.httpOptions); //serve tự động thêm id và ghi vào
    // file data.json
  }

  public updateStock(id: number, body: any): Observable<any> {
    const url = `${this.REST_API_SERVER}/stocks/${id}`; //xđ
    return this.httpClient.put<any>(url, body, this.httpOptions); //Server sẽ tìm theo id và cập nhật
    // lại dữ liệu trong data.json
  }

  public deleteStock(id: number): Observable<any> {
    const url = `${this.REST_API_SERVER}/stocks/${id}`; //xđ
    return this.httpClient.delete<any>(url, this.httpOptions);
  }

  // Toggle Favorite - PATCH
  public toggleFavorite(id: number, isFavorite: boolean): Observable<any> {
    const body = { favorite: isFavorite };
    return this.httpClient.patch<any>(
      `${this.REST_API_SERVER}/Stocks/${id}/favorite`,
      body,
      this.httpOptions,
    );
  }
}
