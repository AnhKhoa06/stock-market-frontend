import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../stock/services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.css',
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: any[] = [];
  removingIds = new Set<number>();
  private timers = new Map<number, any>();
  private sub!: Subscription;

  constructor(
    private toastService: ToastService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.sub = this.toastService.toasts$.subscribe((toasts) => {
      this.toasts = toasts;

      // mỗi toast mới → set timer tự slide-out sau 3000ms
      toasts.forEach((toast) => {
        if (!this.timers.has(toast.id)) {
          const timer = setTimeout(() => this.remove(toast.id), 2000);
          this.timers.set(toast.id, timer);
        }
      });

      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
    this.timers.forEach((t) => clearTimeout(t));
  }

  remove(id: number) {
    // hủy timer nếu user bấm đóng sớm
    if (this.timers.has(id)) {
      clearTimeout(this.timers.get(id));
      this.timers.delete(id);
    }

    // thêm class slide-out → animation chạy
    this.removingIds.add(id);
    this.cdr.detectChanges();

    // sau 200ms animation xong → xóa khỏi data
    setTimeout(() => {
      this.toastService.remove(id);
      this.removingIds.delete(id);
    }, 200);
  }

  isRemoving(id: number): boolean {
    return this.removingIds.has(id);
  }
}
