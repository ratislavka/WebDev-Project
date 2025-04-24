// eventsforu/frontend/src/app/auth.service.ts
import { Injectable } from '@angular/core';
// Make sure HttpHeaders is imported from @angular/common/http
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

// Optional: Define an interface for the expected login response structure
export interface LoginResponse {
  success: boolean;
  // Add other fields if your backend login view returns them in the body
}

// Helper function to get a cookie by name (can be outside the class)

function getCookie(name: string): string | null {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Adjust the URL to match your Django login endpoint.
  private loginUrl = 'http://localhost:8000/login/';
  private logoutUrl = 'http://localhost:8000/logout/';
  private checkAuthUrl = 'http://localhost:8000/is_authenticated/';

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
   * @param username The user's username
   * @param password The user's password
   * @returns Observable containing the success status from the backend.
   */
  login(username: string, password: string): Observable<LoginResponse> {
    console.log('Attempting login for:', username);
    return this.http.post<LoginResponse>(
        this.loginUrl,
        { username, password },
        { withCredentials: true } // Sends cookies
    ).pipe(
        tap(response => {
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
   * Calls the backend logout endpoint, including the CSRF token.
   * Backend handles deleting the httpOnly cookies.
   */
  logout(): Observable<any> {
    // Get the CSRF token from the cookie
    const csrfToken = getCookie('csrftoken'); // Django default cookie name
    if (!csrfToken) {
      console.warn('CSRF token cookie not found. Logout might fail.');
      // Handle this case if needed, maybe return an error observable
      // import { throwError } from 'rxjs';
      // return throwError(() => new Error('CSRF token not found'));
    }

    // Create headers object with the CSRF token
    const headers = new HttpHeaders({
      'X-CSRFToken': csrfToken || '', // Send token in the header
    });

    console.log('AuthService: Attempting logout with CSRF token:', csrfToken);

    // Add headers and withCredentials to the request options
    return this.http.post(this.logoutUrl, {}, { headers: headers, withCredentials: true })
        .pipe(
            tap({
              // Use tap with an observer object to handle next and error separately if needed
              next: () => {
                // This runs only on successful response (e.g., 2xx)
                console.log('AuthService: Logout request successful. Setting isAuthenticated to false in tap()');
                this._isAuthenticated.next(false);
                console.log('Logout successful, auth state set to false.');
              },
              error: (err) => {
                // Log the error but still ensure state is false,
                // as the user intention was to log out.
                console.error('AuthService: Logout HTTP request failed:', err);
                console.log('AuthService: Setting isAuthenticated to false after error.');
                this._isAuthenticated.next(false);
              }
              // finalize can also be used if needed
            })
        );
  }


  /**
   * Checks if the user is currently authenticated by calling a backend endpoint.
   * Relies on cookies being sent automatically.
   */
  checkAuthenticationStatus(): void {
    // Send withCredentials for this check too, as it relies on the auth cookie
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
