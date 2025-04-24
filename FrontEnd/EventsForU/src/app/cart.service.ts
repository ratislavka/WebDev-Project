// eventsforu/frontend/src/app/cart.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Ensure HttpHeaders imported
import { BehaviorSubject, Observable, throwError } from 'rxjs'; // Ensure throwError imported
import { catchError, tap, map } from 'rxjs/operators'; // Ensure operators imported

import { Event } from './models/event.model';
import { BookingItem } from './models/booking-item.model';
import { AuthService } from './auth.service';

// Helper function (ensure this is defined outside the class)
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
export class CartService {

  private apiUrl = 'http://localhost:8000/api/';
  private cartUrl = `${this.apiUrl}cart/`;
  private buyUrl = `${this.cartUrl}buy/`;

  private cartItemsSource = new BehaviorSubject<BookingItem[]>([]);
  public cartItems$ = this.cartItemsSource.asObservable();

  private isLoadingSource = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSource.asObservable();

  constructor(
      private http: HttpClient,
      private authService: AuthService
  ) {
    this.authService.isAuthenticated$.subscribe(isAuth => {
      if (isAuth) {
        this.fetchCart(); // Call fetchCart correctly
      } else {
        this.cartItemsSource.next([]);
      }
    });
  }

  fetchCart(): void {
    if (!this.authService.getIsAuthenticated()) { /* ... */ return; }
    console.log('Fetching cart from backend...');
    this.isLoadingSource.next(true);
    // Remove headers - not needed for GET if auth cookie works
    this.http.get<BookingItem[]>(this.cartUrl, { withCredentials: true }) // Just send credentials
        .pipe(/* ... same tap/catchError ... */)
        .subscribe(/* ... same subscribe block ... */);
  }

  addToCart(event: Event, quantity: number = 1): void {
    if (!this.authService.getIsAuthenticated()) {
      console.error('User not authenticated. Cannot add to cart.');
      alert('Please log in to add items to your cart.');
      return;
    }

    // REMOVE THESE LINES
    // const csrfToken = getCookie('csrftoken');
    // console.log('CSRF token value before check in addToCart:', csrfToken);
    // if (!csrfToken) {
    //   console.error('CSRF token check failed. Cannot add to cart.');
    //   alert('Could not verify request security. Please refresh and try again.');
    //   return; // Stop execution if no token
    // }
    // const headers = new HttpHeaders({ 'X-CSRFToken': csrfToken });
    // END REMOVE

    const payload = { event: event.id, quantity: quantity };

    console.log('Adding to cart:', payload);
    this.isLoadingSource.next(true);

    // Modify this line - remove 'headers: headers'
    this.http.post<BookingItem>(this.cartUrl, payload, { /* headers: headers, */ withCredentials: true }) // KEEP withCredentials: true
        .pipe(
            catchError(err => {
              console.error('Error adding item to cart:', err);
              alert(`Failed to add ${event?.name || 'event'} to cart. Error: ${err.message || 'Unknown error'}`);
              this.isLoadingSource.next(false);
              return throwError(() => err);
            })
        )
        .subscribe((newCartItem: BookingItem) => {
          console.log('Item added:', newCartItem);
          this.fetchCart();
        });
  }


  placeOrder(): Observable<{ message: string }> {
    if (!this.authService.getIsAuthenticated()) {
      console.error('User not authenticated. Cannot place order.');
      return throwError(() => new Error('User not authenticated'));
    }

    // const csrfToken = getCookie('csrftoken');
    // if (!csrfToken) {
    //   console.error('CSRF token not found. Cannot place order.');
    //   return throwError(() => new Error('CSRF token not found'));
    // }
    // const headers = new HttpHeaders({ 'X-CSRFToken': csrfToken });

    console.log('Placing order...');
    this.isLoadingSource.next(true);

    return this.http.post<{ message: string }>(this.buyUrl, {}, { /* headers: headers, */ withCredentials: true })
        .pipe(
            tap((response: { message: string }) => { // Add type annotation
              console.log('Order placement response:', response);
              this.fetchCart(); // Refresh cart (will set loading to false)
            }),
            catchError(err => {
              console.error('Error placing order:', err);
              alert(`Failed to place order. Error: ${err.message || 'Unknown error'}`);
              this.isLoadingSource.next(false);
              return throwError(() => err);
            })
        );
  }


  getCartTotal(): number {
    const items = this.cartItemsSource.getValue();
    return items.reduce((sum, item) => {
      // Add checks for safety as event might theoretically be missing
      const price = item?.event?.price ?? 0;
      const quantity = item?.quantity ?? 0;
      return sum + (price * quantity);
    }, 0);
  }


  getCartItemCount(): number {
    const items = this.cartItemsSource.getValue();
    return items.reduce((sum, item) => sum + (item?.quantity ?? 0), 0);
  }

} // End of CartService class
