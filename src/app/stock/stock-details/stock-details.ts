import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StockService } from '../services/stock.service';
import { Stock } from '../../model/stock';
import { MatIconModule } from '@angular/material/icon';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-stock-details',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './stock-details.html',
  styleUrl: './stock-details.css',
})
export class StockDetails implements OnInit {
  stock: Stock | null = null;
  loading = true; //đang tải dữ liệu

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private stockService: StockService,
    private cdr: ChangeDetectorRef,
    private loadingService: LoadingService,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.loading = false;
      return;
    }

    this.loadingService.show();
    this.stockService.getStockById(Number(id)).subscribe({
      next: (found: any) => {
        if (found) {
          this.stock = new Stock(
            found.name,
            found.code,
            Number(found.price),
            Number(found.previousPrice),
            found.exchange,
          );
          // Gán favorite từ dữ liệu trả về
          (this.stock as any).favorite = found.favorite ?? false;
        }
        this.loading = false;
        this.cdr.detectChanges();
        this.loadingService.hide();
      },
      error: (err) => {
        console.error('Lỗi load chi tiết cổ phiếu', err);
        this.loadingService.hide();
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  backToList() {
    this.router.navigate(['/stocks/list']);
  }
}
