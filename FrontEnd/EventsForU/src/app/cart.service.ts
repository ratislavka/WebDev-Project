import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Event } from './models/event.model';
import { BookingItem } from './models/booking-item.model';
import { AuthService } from './auth.service';

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
    if (!this.authService.getIsAuthenticated()) {
      return;
    }
    this.isLoadingSource.next(true);

    this.http.get<BookingItem[]>(this.cartUrl, { withCredentials: true })
        .pipe(
            tap(items => {
              console.log('Fetched cart items:', items);
              this.cartItemsSource.next(items || []);
            }),
            catchError(err => {
              console.error('Error fetching cart:', err);
              this.cartItemsSource.next([]);
              return throwError(() => err);
            })
        )
        .subscribe({
          next: () => {
            this.isLoadingSource.next(false);
          },
          error: () => {
            this.isLoadingSource.next(false);
          }
        });
  }

  addToCart(event: Event, quantity: number = 1): void {
    if (!this.authService.getIsAuthenticated()) {
      console.error('User not authenticated. Cannot add to cart.');
      alert('Please log in to add items to your cart.');
      return;
    }


    const csrfToken = getCookie('csrftoken');
    console.log('CSRF token value before check in addToCart:', csrfToken);
    if (!csrfToken) {
      console.error('CSRF token check failed. Cannot add to cart.');
      alert('Could not verify request security. Please refresh and try again.');
      return; // Stop execution if no token
    }
    const headers = new HttpHeaders({ 'X-CSRFToken': csrfToken });


    const payload = { event: event.id, quantity: quantity };

    console.log('Adding to cart:', payload);
    this.isLoadingSource.next(true);


    this.http.post<BookingItem>(this.cartUrl, payload, { headers: headers,  withCredentials: true })
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

    const csrfToken = getCookie('csrftoken');
    if (!csrfToken) {
      console.error('CSRF token not found. Cannot place order.');
      return throwError(() => new Error('CSRF token not found'));
    }
    const headers = new HttpHeaders({ 'X-CSRFToken': csrfToken });

    console.log('Placing order...');
    this.isLoadingSource.next(true);

    return this.http.post<{ message: string }>(this.buyUrl, {}, { headers: headers,  withCredentials: true })
        .pipe(
            tap((response: { message: string }) => {
              console.log('Order placement response:', response);
              this.fetchCart();
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
      const price = item?.event?.price ?? 0;
      const quantity = item?.quantity ?? 0;
      return sum + (price * quantity);
    }, 0);
  }


  getCartItemCount(): number {
    const items = this.cartItemsSource.getValue();
    return items.reduce((sum, item) => sum + (item?.quantity ?? 0), 0);
  }

}
