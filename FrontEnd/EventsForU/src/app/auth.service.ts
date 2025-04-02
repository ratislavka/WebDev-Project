import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginResponse {
  token: string;
  user: any; // Adjust the type to match your backend response
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Adjust the URL to match your Django login endpoint.
  private loginUrl = 'http://localhost:8000/api/login/';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.loginUrl, { username, password });
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}
