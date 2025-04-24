// eventsforu/frontend/src/app/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // Import Router
import { AuthService, LoginResponse } from '../auth.service'; // Import AuthService and LoginResponse
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf], // Keep these imports
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  loginError: string = '';
  isLoading: boolean = false; // Optional loading indicator

  // Inject AuthService and Router
  constructor(
      private formBuilder: FormBuilder,
      private authService: AuthService,
      private router: Router
  ) {}

  ngOnInit(): void {
    // Use 'username' to match backend expectation, keep validators
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]], // Changed from 'email'
      password: ['', [Validators.required, Validators.minLength(6)]], // Keep minLength if desired
    });
  }

  // Getter for easy access to form fields in template
  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.loginError = ''; // Clear previous errors

    // Stop here if form is invalid
    if (this.loginForm.invalid) {
      console.log('Login form is invalid');
      return;
    }

    this.isLoading = true; // Show loading indicator

    // Get username and password from the form
    const { username, password } = this.loginForm.value;

    // Call the AuthService login method
    this.authService.login(username, password).subscribe({
      next: (response: LoginResponse) => {
        this.isLoading = false;
        if (response.success) {
          console.log('Login successful, navigating to home.');
          // Navigate to the home page or dashboard on successful login
          this.router.navigate(['/']); // Navigate to root route
        } else {
          console.log('Login failed: Backend reported failure.');
          // Handle backend reporting login failure (e.g., invalid credentials)
          this.loginError = 'Invalid username or password.';
          // Optional: Reset form?
          // this.loginForm.reset();
          // this.submitted = false;
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Login HTTP request failed:', error);
        // Handle HTTP errors (e.g., network issue, server error)
        if (error.status === 0) {
          this.loginError = 'Could not connect to the server. Please try again later.';
        } else if (error.status === 400 || error.status === 401) {
          // Often used for invalid credentials, though our backend returns success:false
          this.loginError = 'Invalid username or password.';
        } else {
          this.loginError = `An unexpected error occurred (${error.status}). Please try again.`;
        }
        // Optional: Reset form?
        // this.loginForm.reset();
        // this.submitted = false;
      }
    });
  }
}
