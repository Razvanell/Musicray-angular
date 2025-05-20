import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { SearchService } from './search.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  searchKey: string = '';

  constructor(
    public authService: AuthService,
    public router: Router,
    private searchService: SearchService
  ) {}

  isLoginOrRegisterPage(): boolean {
    return this.router.url === '/login' || this.router.url === '/register';
  }

  onSearchChange(key: string) {
    this.searchService.setSearchKey(key);
  }
}
