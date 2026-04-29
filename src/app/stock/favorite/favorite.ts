import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { StockService } from '../services/stock.service';
import { Stock } from '../../model/stock';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-favorite',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  templateUrl: './favorite.html',
  styleUrl: './favorite.css',
})
export class Favorite implements OnInit {
  stocks: Stock[] = [];
  currentPage: number = 1;
  pageSize: number = 7;

  constructor(
    private stockService: StockService,
    private cdr: ChangeDetectorRef,
    private loadingService: LoadingService,
  ) {}

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.loadingService.show();
    this.stockService.getStocks().subscribe({
      next: (apiData: any[]) => {
        const all = apiData.map((item) => {
          const stock = new Stock(
            item.name,
            item.code,
            Number(item.price),
            Number(item.previousPrice),
            item.exchange,
          );
          (stock as any).id = item.id;
          (stock as any).favorite = item.favorite ?? false;
          return stock;
        });

        // Lọc chỉ lấy yêu thích
        this.stocks = all.filter((s) => (s as any).favorite === true);
        this.currentPage = 1;
        this.cdr.detectChanges();
        this.loadingService.hide();
      },
      error: (err) => {
        console.error('Lỗi lấy danh sách', err);
        this.loadingService.hide();
      },
    });
  }

  get totalPages(): number {
    return Math.ceil(this.stocks.length / this.pageSize);
  }

  get pagedStocks(): Stock[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.stocks.slice(start, start + this.pageSize);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}
