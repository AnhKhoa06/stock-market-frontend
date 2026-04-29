import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: number;
  type: 'success' | 'error';
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toastsSubject.asObservable();
  private nextId = 0;

  show(message: string, type: 'success' | 'error' = 'success') {
    const toast: Toast = { id: this.nextId++, type, message };
    this.toastsSubject.next([...this.toastsSubject.value, toast]);
    // KHÔNG setTimeout ở đây nữa
  }

  remove(id: number) {
    this.toastsSubject.next(this.toastsSubject.value.filter((t) => t.id !== id));
  }
}
