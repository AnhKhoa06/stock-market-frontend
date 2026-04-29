import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../stock/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  username: string = '';
  avatarLetter: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.username = this.authService.getUsername();
    this.avatarLetter = this.username.charAt(0).toUpperCase();
  }
}
