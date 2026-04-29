import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../stock/services/loading.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.html',
  styleUrl: './loading.css',
})
export class LoadingComponent {
  constructor(public loadingService: LoadingService) {}
}
