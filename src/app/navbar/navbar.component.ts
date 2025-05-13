import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { User } from '../user/user';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  postForm: FormGroup;
  loginForm: FormGroup;

  constructor(
    public authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.postForm = this.formBuilder.group({
      firstName: ['', Validators.minLength(2)],
      lastName: ['', Validators.minLength(2)],
      email: ['', Validators.minLength(5)],
      password: ['', Validators.minLength(4)],
      confirmPassword: ['', Validators.minLength(4)]
    });

    this.loginForm = this.formBuilder.group({
      email: ['', Validators.minLength(5)],
      password: ['', Validators.minLength(4)]
    });
  }

  public onOpenNavModal(mode: 'login' | 'post'): void {
    const modalId = mode === 'login' ? 'loginUserModal' : 'postUserModal';
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    } else {
      console.error(`Modal with ID ${modalId} not found.`);
    }
  }

  public onLoginUser(): void {
    this.authService.loginUser(this.loginForm.value).subscribe(
      (response: any) => {
        const user = response.result.user;
        user.token = response.result.token;
        this.authService.setUser(user);
        this.loginForm.reset();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        this.loginForm.reset();
      }
    );
  }

  public onPostUser(): void {
    this.authService.postUser(this.postForm.value).subscribe(
      (response: User) => {
        console.log(this.postForm.value);
        this.postForm.reset();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        this.postForm.reset();
      }
    );
  }
}
