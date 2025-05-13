import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user/user';
import { AuthService } from './auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [ReactiveFormsModule, CommonModule], 
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  postForm: FormGroup;
  loginForm: FormGroup;
    
  constructor(public authService: AuthService,
    private router: Router,
    private FormBuilder: FormBuilder) {
    
    this.postForm = this.FormBuilder.group({
      firstName: ["", Validators.minLength(2)],
      lastName: ["", Validators.minLength(2)],
      email: ["", Validators.minLength(5)],
      password: ["", Validators.minLength(4)],
      confirmPassword: ["", Validators.minLength(4)]
    });

    this.loginForm = this.FormBuilder.group({
      email: ["", Validators.minLength(5)],
      password: ["", Validators.minLength(4)]
    });
  }

  public onOpenNavModal(mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button')
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal')
    if (mode === 'login') {
      button.setAttribute('data-target', '#loginUserModal');
    }
    if (mode === 'post') {
      button.setAttribute('data-target', '#postUserModal');
    }
    if (container) {
      container.appendChild(button);
    } else {
      console.error('Container element not found');
    }
    button.click();
  }

  public onLoginUser(): void {
    const loginFormElement = document.getElementById('login-user-form');
    if (loginFormElement) {
      loginFormElement.click();
    } else {
      console.error('Login user form element not found');
    }
    this.authService.loginUser(this.loginForm.value).subscribe(
      (response: any) => {
        console.log(response);
        let user = response.result.user;
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
    const postUserFormElement = document.getElementById('post-user-form');
    if (postUserFormElement) {
      postUserFormElement.click();
    } else {
      console.error('Post user form element not found');
    }
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

