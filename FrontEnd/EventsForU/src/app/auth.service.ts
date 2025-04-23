import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, timer, of } from 'rxjs';
import { catchError, tap, switchMap, shareReplay } from 'rxjs/operators';
import { environment } from '../environments/environment'; // Uses correct path

// Interface for login credentials
export interface LoginCredentials {
  username: string;
  password: string;
}

// Interface for login response (based on your custom view)
export interface LoginResponse {
  success: boolean;
  // Add other fields if your login view returns more data
}

// Interface for refresh response
export interface RefreshResponse {
  refreshed: boolean;
}

// Interface for logout response
export interface LogoutResponse {
  success: boolean;
}

// Interface for authentication status check response
export interface AuthStatusResponse {
  authenticated: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  // BehaviorSubject holds the current authentication state (true/false/null for initial check)
  private authenticationState = new BehaviorSubject<boolean | null>(null);
  // Public observable for components to subscribe to auth changes
  isAuthenticated$ = this.authenticationState.asObservable();

  // Timer for refreshing token
  private refreshTimerSubscription: any = null; // Store subscription to potentially cancel

  constructor(private http: HttpClient) {
    // Check authentication status when the service initializes
    // Use catchError to prevent initial check failure from breaking app load
    this.checkAuthStatus().pipe(catchError(() => of(null))).subscribe();
  }

  /**
   * Checks the current authentication status with the backend.
   * Endpoint: POST /api/is_authenticated/
   * Updates the authenticationState BehaviorSubject.
   */
  checkAuthStatus(): Observable<AuthStatusResponse> {
    console.log('Checking auth status...');
    // Use POST as defined in your fbv.py
    return this.http.post<AuthStatusResponse>(`${this.apiUrl}/is_authenticated/`, {})
      .pipe(
        tap(response => {
          console.log('Auth status check response:', response);
          this.authenticationState.next(response.authenticated);
          if (response.authenticated) {
            this.scheduleTokenRefresh(); // Schedule refresh if authenticated
          } else {
            this.stopTokenRefreshTimer();
          }
        }),
        catchError(error => {
          console.error('Auth status check failed:', error);
          this.authenticationState.next(false); // Assume not authenticated on error
          this.stopTokenRefreshTimer();
          // Rethrow a user-friendly error or handle silently
          return throwError(() => new Error('Failed to check authentication status.'));
        }),
        shareReplay(1) // Cache the last result
      );
  }


  /**
   * Attempts to log in the user using credentials.
   * Endpoint: POST /api/login/
   */
  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login/`, credentials)
      .pipe(
        tap(response => {
          console.log('Login response:', response);
          this.authenticationState.next(response.success);
          if (response.success) {
            this.scheduleTokenRefresh(); // Start refresh timer on successful login
          }
        }),
        catchError(this.handleError) // Use shared error handler
      );
    // Component calling login should subscribe and handle navigation/messages
  }

  /**
   * Logs out the user by calling the backend endpoint.
   * Endpoint: POST /api/logout/
   */
  logout(): Observable<LogoutResponse> {
    return this.http.post<LogoutResponse>(`${this.apiUrl}/logout/`, {})
      .pipe(
        tap(response => {
          console.log('Logout response:', response);
          this.authenticationState.next(false); // Update state to not authenticated
          this.stopTokenRefreshTimer(); // Stop refresh timer on logout
        }),
        catchError(error => {
          console.error('Logout failed:', error);
          // Even if logout API fails, update frontend state
          this.authenticationState.next(false);
          this.stopTokenRefreshTimer();
          return this.handleError(error);
        })
      );
    // Component calling logout should subscribe and handle navigation/messages
  }

  /**
   * Attempts to refresh the JWT access token using the refresh token cookie.
   * Endpoint: POST /api/refresh/
   */
  refreshToken(): Observable<RefreshResponse> {
    console.log('Attempting token refresh...');
    return this.http.post<RefreshResponse>(`${this.apiUrl}/refresh/`, {})
      .pipe(
        tap(response => {
          console.log('Token refresh response:', response.refreshed);
          if (!response.refreshed) {
            // If refresh fails, consider the user logged out
            this.authenticationState.next(false);
            this.stopTokenRefreshTimer();
          } else {
            // Refresh successful, user is still authenticated
            this.authenticationState.next(true);
          }
        }),
        catchError(error => {
          console.error('Token refresh failed:', error);
          this.authenticationState.next(false); // Assume logout if refresh fails
          this.stopTokenRefreshTimer();
          return throwError(() => new Error('Token refresh failed.'));
        })
      );
  }

  /** Schedules periodic token refresh */
  private scheduleTokenRefresh(): void {
    this.stopTokenRefreshTimer(); // Clear existing timer

    // Refresh slightly before token likely expires (e.g., 4 minutes for a 5-min token)
    const refreshInterval = 240000; // 4 minutes in milliseconds

    this.refreshTimerSubscription = timer(refreshInterval, refreshInterval).pipe(
      switchMap(() => this.refreshToken().pipe(catchError(() => of(null)))) // Catch error within switchMap
    ).subscribe();

    console.log(`Token refresh scheduled every ${refreshInterval / 60000} minutes.`);
  }

  /** Stops the token refresh timer */
  private stopTokenRefreshTimer(): void {
    if (this.refreshTimerSubscription) {
      this.refreshTimerSubscription.unsubscribe();
      this.refreshTimerSubscription = null;
      console.log('Token refresh timer stopped.');
    }
  }

  /** Basic error handler */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Authentication operation failed!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Network error: ${error.error.message}`;
    } else {
      errorMessage = `Backend returned code ${error.status}: ${error.message}`;
      if (error.error && error.error.detail) {
        errorMessage += `\nDetails: ${error.error.detail}`;
      } else if (error.error && typeof error.error === 'object') {
        errorMessage += `\nBody: ${JSON.stringify(error.error)}`;
      } else if (error.error) {
        errorMessage += `\nBody: ${error.error}`;
      }
    }
    console.error('AuthService Error:', errorMessage);
    return throwError(() => new Error('Authentication failed. Please check credentials or try again.'));
  }
}
