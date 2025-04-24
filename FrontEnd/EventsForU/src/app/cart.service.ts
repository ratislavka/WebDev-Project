// eventsforu/frontend/src/app/cart.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

import { Event } from './models/event.model'; // Use the backend-aligned Event model
import { BookingItem } from './models/booking-item.model'; // Use the new BookingItem model
import { AuthService } from './auth.service'; // Needed to check auth status

// Helper function to get CSRF token (can be kept from AuthService)
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

  // Base URL for your Django backend API
  private apiUrl = 'http://localhost:8000/api/';
  private cartUrl = `${this.apiUrl}cart/`;
  private buyUrl = `${this.cartUrl}buy/`; // URL for the buy action

  // BehaviorSubject holds the current state of the cart (BookingItem[])
  private cartItemsSource = new BehaviorSubject<BookingItem[]>([]);
  public cartItems$ = this.cartItemsSource.asObservable();

  // Keep track of loading state for the cart
  private isLoadingSource = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSource.asObservable();

  constructor(
      private http: HttpClient,
      private authService: AuthService // Inject AuthService
  ) {
    // When auth status changes, fetch the cart if user is authenticated
    this.authService.isAuthenticated$.subscribe(isAuth => {
      if (isAuth) {
        this.fetchCart();
      } else {
        // Clear cart when user logs out
        this.cartItemsSource.next([]);
      }
    });
  }

  /**
   * Fetches the user's current cart items from the backend.
   * Requires user to be authenticated (handled by backend permissions).
   */
  fetchCart(): void {
    if (!this.authService.getIsAuthenticated()) {
      // console.log('User not authenticated, cannot fetch cart.'); // Already logged
      this.cartItemsSource.next([]);
      return;
    }

    const csrfToken = getCookie('csrftoken');
    // Add headers, even for GET
    const headers = new HttpHeaders({
      'X-CSRFToken': csrfToken || ''
    });

    console.log('Fetching cart from backend with CSRF:', csrfToken);
    this.isLoadingSource.next(true);
    // Add headers to the request
    this.http.get<BookingItem[]>(this.cartUrl, { headers: headers, withCredentials: true })
        .pipe(
            tap(items => console.log('Raw cart items fetched:', items)),
            catchError(err => {
              console.error('Error fetching cart:', err);
              this.cartItemsSource.next([]);
              this.isLoadingSource.next(false); // Ensure loading stops on error
              return throwError(() => err);
            })
        )
        .subscribe(items => {
          this.cartItemsSource.next(items || []);
          this.isLoadingSource.next(false); // Ensure loading stops on success
          console.log('Cart state updated.');
        });
  }

  /**
   * Adds an event to the user's cart via the backend API.
   * Requires user to be authenticated.
   * @param event The event to add (using the new Event model)
   * @param quantity The quantity to add (defaulting to 1)
   */
  addToCart(event: Event, quantity: number = 1): void {
    if (!this.authService.getIsAuthenticated()) {
      console.error('User not authenticated. Cannot add to cart.');
      // Optionally: Redirect to login or show a message
      alert('Please log in to add items to your cart.');
      return;
    }

    const csrfToken = getCookie('csrftoken');
    if (!csrfToken) {
      console.error('CSRF token not found. Cannot add to cart.');
      alert('Could not verify request security. Please refresh and try again.');
      return;
    }

    const headers = new HttpHeaders({ 'X-CSRFToken': csrfToken });
    // Backend expects 'event' (ID) and 'quantity'
    const payload = { event: event.id, quantity: quantity };

    console.log('Adding to cart:', payload);
    this.isLoadingSource.next(true); // Indicate loading

    this.http.post<BookingItem>(this.cartUrl, payload, { headers: headers, withCredentials: true })
        .pipe(
            catchError(err => {
              console.error('Error adding item to cart:', err);
              alert(`Failed to add ${event.name} to cart. Error: ${err.message || 'Unknown error'}`);
              this.isLoadingSource.next(false); // Stop loading on error
              return throwError(() => err);
            })
        )
        .subscribe(newCartItem => {
          console.log('Item added:', newCartItem);
          // Refresh the entire cart state after adding successfully
          this.fetchCart();
          // Don't set isLoadingSource to false here, let fetchCart handle it
        });
  }


  /**
   * Places the order by calling the backend 'buy' action.
   * Requires user to be authenticated.
   */
  placeOrder(): Observable<{ message: string }> { // Backend returns { "message": "..." }
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
    this.isLoadingSource.next(true); // Indicate loading

    return this.http.post<{ message: string }>(this.buyUrl, {}, { headers: headers, withCredentials: true })
        .pipe(
            tap(response => {
              console.log('Order placement response:', response);
              // Refresh cart (should be empty now) after successful order
              this.fetchCart();
            }),
            catchError(err => {
              console.error('Error placing order:', err);
              alert(`Failed to place order. Error: ${err.message || 'Unknown error'}`);
              this.isLoadingSource.next(false); // Stop loading on error
              return throwError(() => err);
            })
            // Don't set isLoadingSource to false here, let fetchCart handle it
        );
  }


  /**
   * Calculates the total price of items currently in the cart state.
   */
  getCartTotal(): number {
    const items = this.cartItemsSource.getValue();
    // The 'total' might already be calculated per item by the backend serializer
    // Or calculate manually: item.event.price * item.quantity
    return items.reduce((sum, item) => sum + (item.event.price * item.quantity), 0);
  }

  /**
   * Gets the total number of items (sum of quantities) in the cart.
   */
  getCartItemCount(): number {
    const items = this.cartItemsSource.getValue();
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }


  // --- Local Storage / Old Methods Removal ---
  // Removed getCartItemsFromStorage, saveCartItemsToStorage
  // Removed local storage keys
  // Removed old getGroupedCartItems (can be re-implemented if needed based on BookingItem[])
  // Removed old placeOrder logic
  // Removed old getOrderHistory logic (will be handled separately)

  // Note: A 'removeItem' or 'updateQuantity' method would typically require
  // DELETE or PUT/PATCH requests to the backend API endpoint (`/api/cart/{booking_item_id}/`)
  // and corresponding backend view logic in CartViewSet.
  // This is not implemented here yet.
}
