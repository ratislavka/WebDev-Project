import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';


export interface LoginResponse {
  success: boolean;

}

// Helper function
function getCookie(name: string): string | null {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
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
  private loginUrl = 'http://localhost:8000/login/';
  private logoutUrl = 'http://localhost:8000/logout/';
  private checkAuthUrl = 'http://localhost:8000/is_authenticated/';

  // BehaviorSubject to hold the authentication state
  private _isAuthenticated = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this._isAuthenticated.asObservable();

  constructor(private http: HttpClient) {
    this.checkAuthenticationStatus();
  }


  login(username: string, password: string): Observable<LoginResponse> {
    console.log('Attempting login for:', username);
    return this.http.post<LoginResponse>(
        this.loginUrl,
        { username, password },
        { withCredentials: true }
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
    const csrfToken = getCookie('csrftoken');
    if (!csrfToken) {
      console.warn('CSRF token cookie not found. Logout might fail.');
    }

    // Create headers object with the CSRF token
    const headers = new HttpHeaders({
      'X-CSRFToken': csrfToken || '',
    });

    console.log('AuthService: Attempting logout with CSRF token:', csrfToken);

      return this.http.post(this.logoutUrl, {}, { withCredentials: true })
        .pipe(
            tap({
              // Use tap with an observer object to handle next and error separately if needed
              next: () => {
                console.log('AuthService: Logout request successful. Setting isAuthenticated to false in tap()');
                this._isAuthenticated.next(false);
                console.log('Logout successful, auth state set to false.');
              },
              error: (err) => {
                console.error('AuthService: Logout HTTP request failed:', err);
                console.log('AuthService: Setting isAuthenticated to false after error.');
                this._isAuthenticated.next(false);
              }
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
            this._isAuthenticated.next(false);
            console.log('Authentication check failed, setting status to false.');
          }
        });
  }

  getIsAuthenticated(): boolean {
    return this._isAuthenticated.getValue();
  }
}
