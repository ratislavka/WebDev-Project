import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { AuthService, LoginResponse } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports:
    [
    ReactiveFormsModule
  ],
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup; // Use '!' to denote definite assignment
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.authService.login(username, password).subscribe({
        next: (res: LoginResponse) => {
          // Save the token locally (for example, in localStorage).
          localStorage.setItem('token', res.token);
          // Optionally, store other user info if needed.
          // Navigate to the main page (adjust the route as needed).
          this.router.navigate(['/']);
        },
        error: (err) => {
          // Handle error (for instance, wrong credentials).
          this.error = 'Invalid username or password';
        }
      });
    }
  }
}
