import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment'; // Correct path

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const apiUrl = environment.apiUrl;

    // Only add withCredentials for requests going to your backend API
    if (request.url.startsWith(apiUrl)) {
      // Clone the request to add the withCredentials option
      request = request.clone({
        withCredentials: true
      });
      // console.log('AuthInterceptor: Added withCredentials=true for API request:', request.url);
    }

    // Pass the cloned or original request to the next handler
    return next.handle(request);
  }
}

