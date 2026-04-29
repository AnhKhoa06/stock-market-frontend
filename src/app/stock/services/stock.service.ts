import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Stock } from '../../model/stock';
import { HttpServiceService } from './http-service.service';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  constructor(private httpService: HttpServiceService) {}
  //any là kiểu dl trả về nhưng chưa dc định nghĩa rõ là kiểu dl gì
  getStocks(): Observable<any> {
    return this.httpService.getStocks(); //nhận lại Obser và trả lại cho component
  }

  getStockById(id: number): Observable<any> {
    return this.httpService.getStockById(id);
  }

  //nhan.obj.Stock
  createStock(stock: Stock): Observable<any> {
    return this.httpService.postStock(stock);
  }

  updateStock(id: number, updated: Stock): Observable<any> {
    return this.httpService.updateStock(id, updated);
  }

  deleteStock(id: number): Observable<any> {
    return this.httpService.deleteStock(id);
  }

  toggleFavorite(id: number, isFavorite: boolean): Observable<any> {
    return this.httpService.toggleFavorite(id, isFavorite);
  }
}
