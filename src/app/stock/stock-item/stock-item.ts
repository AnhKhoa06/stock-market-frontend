import { Component, Input } from '@angular/core';
import { Stock } from '../../model/stock';
//hiển thị từng phần tử  .... cho.p nhandl tu cp.cha
@Component({
  selector: 'app-stock-item',
  templateUrl: './stock-item.html',
  styleUrl: './stock-item.css',
})
export class StockItem {
  @Input() stock!: Stock;

  toggleFavorite() {
    this.stock.favorite = !this.stock.favorite;
  }
}
