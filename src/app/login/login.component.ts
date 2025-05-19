import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../navbar/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      firstName: ['', Validators.minLength(2)],
      lastName: ['', Validators.minLength(2)],
      email: ['', Validators.minLength(5)],
      password: ['', Validators.minLength(4)],
      confirmPassword: ['', Validators.minLength(4)]
    });
  }

  ngOnInit(): void {
    // Create the form group for login
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  // Getters for easy access to form controls
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onLoginUser(): void {
    // Call the login function from AuthService
    if (this.loginForm.valid) {
      this.authService.loginUser(this.loginForm.value).subscribe(
        (response: any) => {
          const user = response.result.user;
          user.token = response.result.token;
          this.authService.setUser(user); // Store the user
          this.loginForm.reset(); // Reset the form
          this.router.navigate(['/home']); // Redirect to home page
        },
        (error: HttpErrorResponse) => {
          alert('Login failed: ' + error.message);
          this.loginForm.reset();
        }
      );
    } else {
      alert('Please fill out all required fields.');
    }
  }
}
