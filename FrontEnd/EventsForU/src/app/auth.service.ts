// eventsforu/frontend/src/app/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs'; // Import tap

// Optional: Define an interface for the expected login response structure
// Based on CustomerTokenObtainPairView response (sets cookies, returns success/failure)
// The actual JWT tokens are in httpOnly cookies, not the response body here.
export interface LoginResponse {
  success: boolean;
  // Add other fields if your backend login view returns them in the body
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Adjust the URL to match your Django login endpoint.
  private loginUrl = 'http://localhost:8000/login/';
  private logoutUrl = 'http://localhost:8000/logout/';
  private checkAuthUrl = 'http://localhost:8000/is_authenticated/'; //

  // BehaviorSubject to hold the authentication state
  private _isAuthenticated = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this._isAuthenticated.asObservable();

  constructor(private http: HttpClient) {
    // Optional: Check authentication status when the service initializes
    this.checkAuthenticationStatus();
  }

  /**
   * Attempts to log in the user by sending credentials to the backend.
   * Backend handles setting httpOnly cookies for JWT tokens.
   * @param username The user's username (not email, based on Django User model)
   * @param password The user's password
   * @returns Observable containing the success status from the backend.
   */
  login(username: string, password: string): Observable<LoginResponse> {
    console.log('Attempting login for:', username);
    return this.http.post<LoginResponse>(
        this.loginUrl,
        { username, password },
        { withCredentials: true } // Crucial: Sends cookies along with the request
    ).pipe(
        tap(response => {
          // Update authentication state based on successful login response
          this._isAuthenticated.next(response.success);
          if (!response.success) {
            console.error('Backend login reported failure.');
          } else {
            console.log('Login successful, auth state updated.');
          }
        })
    );
  }

  /**
   * Calls the backend logout endpoint.
   * Backend handles deleting the httpOnly cookies.
   */
  logout(): Observable<any> {
    return this.http.post(this.logoutUrl, {}, { withCredentials: true })
        .pipe(
            tap(() => {
              // Always set authenticated state to false on logout attempt
              this._isAuthenticated.next(false);
              console.log('Logout attempted, auth state set to false.');
            })
        );
  }

  /**
   * Checks if the user is currently authenticated by calling a backend endpoint.
   * Relies on cookies being sent automatically.
   */
  checkAuthenticationStatus(): void {
    this.http.post<{ authenticated: boolean }>(this.checkAuthUrl, {}, { withCredentials: true })
        .subscribe({
          next: (response) => {
            this._isAuthenticated.next(response.authenticated);
            console.log('Authentication check successful, status:', response.authenticated);
          },
          error: (err) => {
            // If the check fails (e.g., 401 Unauthorized), assume not authenticated
            this._isAuthenticated.next(false);
            console.log('Authentication check failed, setting status to false.');
          }
        });
  }

  // Getter to check the current authentication status synchronously
  getIsAuthenticated(): boolean {
    return this._isAuthenticated.getValue();
  }
}
