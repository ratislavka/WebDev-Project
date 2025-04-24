import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginResponse } from '../auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  loginError: string = '';
  isLoading: boolean = false;

  constructor(
      private formBuilder: FormBuilder,
      private authService: AuthService,
      private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  // Getter for easy access to form fields in template
  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.loginError = '';

    // Stop here if form is invalid
    if (this.loginForm.invalid) {
      console.log('Login form is invalid');
      return;
    }

    this.isLoading = true;

    // Get username and password from the form
    const { username, password } = this.loginForm.value;

    // Call the AuthService login method
    this.authService.login(username, password).subscribe({
      next: (response: LoginResponse) => {
        this.isLoading = false;
        if (response.success) {
          // Navigate to the home page or dashboard on successful login
          this.router.navigate(['/']); // Navigate to root route
        } else {
          this.loginError = 'Invalid username or password.';
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Login HTTP request failed:', error);
        // Handle HTTP errors
        if (error.status === 0) {
          this.loginError = 'Could not connect to the server. Please try again later.';
        } else if (error.status === 400 || error.status === 401) {
          this.loginError = 'Invalid username or password.';
        } else {
          this.loginError = `An unexpected error occurred (${error.status}). Please try again.`;
        }
      }
    });
  }
}
