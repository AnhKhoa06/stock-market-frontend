import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Stock } from '../../model/stock';

@Component({
  selector: 'app-create-stock',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-stock.html',
  styleUrl: './create-stock.css',
})
export class CreateStock {
  stock: Stock = new Stock('', '', 0, 0, '');
  exchanges = ['NASDAQ', 'NYSE', 'HOSE'];
  confirmed = false;

  stockList: Stock[] = [];
  createStock() {
    this.stockList.push(
      // thêm stock vào ds
      new Stock(
        this.stock.name,
        this.stock.code,
        this.stock.price,
        this.stock.previousPrice,
        this.stock.exchange,
      ),
    );

    console.log(this.stockList);
    this.confirmed = true;
    // reset form
    this.stock = new Stock('', '', 0, 0, '');
  }
}
