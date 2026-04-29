import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StockService } from '../services/stock.service';
import { Stock } from '../../model/stock';
import { MatIconModule } from '@angular/material/icon';
import { ToastService } from '../services/toast.service';
import { LoadingService } from '../services/loading.service';

//chứa ds
@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.html',
  styleUrls: ['./stock-list.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatIconModule],
})

//bài th số 5
// export class StockList {
//   //s khi stock thaydoi
//   stocks: Stock[] = [
//     new Stock('Test Stock Company', 'TSC', 85, 80, 'NASDAQ'),
//     new Stock('Second Stock Company', 'SSC', 10, 20, 'NSE'),
//     new Stock('Last Stock Company', 'LSC', 876, 800, 'NYSE'),
//   ];
//   addStock(stock: Stock) {
//     this.stocks.push(stock);
//   }
// }
export class StockList implements OnInit {
  stocks: Stock[] = [];
  filteredStocks: Stock[] = [];
  searchTerm: string = '';
  //khi cp load, gọi hàm refresh
  selectedStock: Stock | null = null;
  editingStock: Stock | null = null;
  isUpdateMode: boolean = false;

  // phân trang
  currentPage: number = 1;
  pageSize: number = 7;

  get totalPages(): number {
    return Math.ceil(this.filteredStocks.length / this.pageSize);
  }

  get pagedStocks(): Stock[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredStocks.slice(start, start + this.pageSize);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  constructor(
    private stockService: StockService,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService,
    private loadingService: LoadingService,
  ) {}

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.loadingService.show();
    this.stockService.getStocks().subscribe({
      next: (apiData: any[]) => {
        //nhận dl
        this.stocks = apiData.map((item) => {
          //xly dl
          const stock = new Stock(
            item.name,
            item.code,
            Number(item.price),
            Number(item.previousPrice),
            item.exchange,
          );
          (stock as any).id = item.id; //up, del
          (stock as any).favorite = item.favorite ?? false;
          return stock;
        });

        this.filteredStocks = [...this.stocks]; //gán

        this.cdr.detectChanges();
        this.loadingService.hide();
      },

      error: (err) => {
        console.error('Lỗi lấy danh sách', err);
        this.loadingService.hide();
      },
    });
  }

  // Toggle Favorite - Dùng cho Checkbox
  toggleFavorite(stock: Stock, event: any) {
    const newFavorite = event.target.checked;
    const stockId = (stock as any).id;

    if (!stockId) {
      console.error('Không tìm thấy ID cổ phiếu');
      return;
    }

    this.stockService.toggleFavorite(stockId, newFavorite).subscribe({
      next: () => {
        // Cập nhật ngay trên giao diện
        (stock as any).favorite = newFavorite;
        this.filteredStocks = [...this.stocks]; // Đồng bộ lại danh sách lọc
        this.cdr.detectChanges();
        this.toastService.show(
          newFavorite ? 'Đã thêm vào yêu thích!' : 'Đã xóa khỏi yêu thích!',
          'success',
        );
      },
      error: (err) => {
        console.error('Lỗi cập nhật favorite:', err);
        this.toastService.show('Không thể cập nhật trạng thái yêu thích!', 'error');

        // Rollback checkbox về trạng thái cũ nếu lỗi
        event.target.checked = !newFavorite;
      },
    });
  }

  onSearch(event: any) {
    this.searchTerm = event.target.value.toLowerCase().trim();
    this.filteredStocks = this.stocks.filter(
      (s) =>
        s.name.toLowerCase().includes(this.searchTerm) ||
        s.code.toLowerCase().includes(this.searchTerm),
    );
    this.currentPage = 1; // reset về trang 1
  }

  deleteStock(id?: number) {
    if (confirm('Bạn có chắc muốn xóa cổ phiếu này không?')) {
      this.loadingService.show();
      this.stockService.deleteStock(id!).subscribe({
        next: () => {
          this.refresh();
          this.toastService.show('Xóa cổ phiếu thành công!', 'success');
          this.loadingService.hide();
        },
        error: () => {
          this.toastService.show('Lỗi khi xóa cổ phiếu!', 'error');
          this.loadingService.hide();
        },
      });
    }
  }

  openDetail(stock: Stock) {
    this.selectedStock = stock;
    this.editingStock = null;
    this.isUpdateMode = false;
  }

  openUpdate(stock: Stock) {
    this.selectedStock = stock; //luustockdag chon
    this.editingStock = new Stock(
      stock.name,
      stock.code,
      stock.price,
      stock.previousPrice,
      stock.exchange,
    );
    (this.editingStock as any).id = (stock as any).id;
    (this.editingStock as any).favorite = (stock as any).favorite;
    this.isUpdateMode = true;
  }

  saveUpdate() {
    if (this.editingStock) {
      const id = (this.editingStock as any).id;
      if (!id) {
        this.toastService.show('Không tìm thấy ID để cập nhật', 'error');
        return;
      }
      this.loadingService.show();
      this.stockService.updateStock(id, this.editingStock).subscribe({
        next: () => {
          this.refresh();
          this.closeDialog();
          this.toastService.show('Cập nhật cổ phiếu thành công!', 'success');
          this.loadingService.hide();
        },
        error: () => {
          this.toastService.show('Lỗi khi cập nhật cổ phiếu!', 'error');
          this.loadingService.hide();
        },
      });
    }
  }

  closeDialog() {
    this.selectedStock = null;
    this.editingStock = null;
    this.isUpdateMode = false;
  }
}
