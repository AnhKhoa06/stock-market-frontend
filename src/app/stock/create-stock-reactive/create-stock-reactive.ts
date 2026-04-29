import { Component, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Stock } from '../../model/stock';
import { StockService } from '../services/stock.service';
import { MatIconModule } from '@angular/material/icon';
import { ToastService } from '../services/toast.service';
import { LoadingService } from '../services/loading.service';

//truyen dl giua các component, khi tạo stock thì sẽ gửi dl ra ngoài và cho phép component cha nhận dl
@Component({
  selector: 'app-create-stock-reactive',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './create-stock-reactive.html',
  styleUrl: './create-stock-reactive.css',
})
export class CreateStockReactive {
  stockForm!: FormGroup;
  successMessage: string = '';
  submitted = false;

  @Output() stockCreated = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private stockService: StockService,
    private router: Router,
    private toastService: ToastService,
    private loadingService: LoadingService,
  ) {
    this.createForm();
  }

  createForm() {
    this.stockForm = this.fb.group({
      name: [null, Validators.required],
      code: [null, [Validators.required, Validators.minLength(2)]],
      price: [0, [Validators.required, Validators.min(0)]],
      exchange: ['NASDAQ'],
      confirm: [false, Validators.requiredTrue],
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.stockForm.invalid) {
      this.toastService.show('Vui lòng nhập đầy đủ thông tin!', 'error');
      return;
    }
    const formData = this.stockForm.value;
    //chuyendl tu f
    const newStock = new Stock(
      this.stockForm.value.name,
      this.stockForm.value.code,
      this.stockForm.value.price,
      this.stockForm.value.price,
      this.stockForm.value.exchange,
    );

    this.loadingService.show();
    this.stockService.createStock(newStock).subscribe({
      next: (result: any) => {
        this.loadingService.hide();
        this.stockForm.reset({
          name: null,
          code: null,
          price: 0,
          exchange: 'NASDAQ',
          confirm: false,
        });

        this.stockCreated.emit();
        this.router.navigate(['/stocks/list']).then(() => {
          this.toastService.show(`Tạo cổ phiếu ${formData.code} thành công!`, 'success');
        });
      },
      error: (err: any) => {
        this.loadingService.hide();
        this.toastService.show(err.msg || 'Lỗi tạo cổ phiếu!', 'error');
      },
    });
  }

  get name() {
    return this.stockForm.get('name');
  }
  get code() {
    return this.stockForm.get('code');
  }
  get price() {
    return this.stockForm.get('price');
  }
  get confirm() {
    return this.stockForm.get('confirm');
  }
}
