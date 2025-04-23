import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of, forkJoin } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { Event } from './event.service'; // Import Event interface

// --- EXPORTED INTERFACES ---

// Event interface expected within OrderItem/Ticket (ensure date is string as it comes from JSON)
export interface NestedEvent extends Omit<Event, 'date' | 'imageUrl'> {
  date: string; // Keep date as string within nested objects initially
  // imageUrl is added by EventService, might not be present here
}

// Interface matching BookingItem structure from backend, used for cart items
export interface OrderItem {
  id: number; // BookingItem ID
  customer?: any;
  event: NestedEvent; // Use nested event interface
  booking_date: string; // Keep as string from JSON initially
  quantity: number;
  complete: boolean;
  total?: number;
  // --- Derived properties added after fetching/mapping ---
  booking_date_obj?: Date; // Optional: Date object version
  event_date_obj?: Date; // Optional: Date object version
}

// Interface for the structure returned by the place order endpoint
export interface Order {
  id: number | string;
  created_at?: string; // Keep as string from JSON initially
  total_price?: number;
  items?: OrderItem[];
  // --- Derived properties ---
  created_at_obj?: Date; // Optional: Date object version
}

// Interface matching Ticket structure from backend (used for order history)
export interface Ticket {
  id: number; // Ticket ID
  customer: any;
  booking_item: OrderItem; // The related BookingItem
  status: boolean;
  // --- Derived properties ---
  // Dates within booking_item will be converted after fetching
}

// --- END OF INTERFACES ---


@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = environment.apiUrl;
  private cartItemsSource = new BehaviorSubject<OrderItem[]>([]);

  items$: Observable<OrderItem[]> = this.cartItemsSource.asObservable();
  cartTotal$: Observable<number> = this.items$.pipe(
    map(items => items.reduce((sum, item) => sum + (item.total ?? 0), 0))
  );
  cartItemCount$: Observable<number> = this.items$.pipe(
    map(items => items.reduce((sum, item) => sum + item.quantity, 0))
  );

  constructor(private http: HttpClient) {
    this.fetchCart();
  }

  /** Fetches cart items and converts relevant dates */
  fetchCart(): void {
    const url = `${this.apiUrl}/cart/`;
    this.http.get<OrderItem[]>(url).pipe( // Fetch raw OrderItem data
      map(items => items.map(item => ({ // Convert dates after fetching
        ...item,
        booking_date_obj: new Date(item.booking_date), // Add Date object version
        event: {
          ...item.event,
          // Keep original event.date as string, add Date object version if needed elsewhere
          // event_date_obj: new Date(item.event.date)
        }
      }))),
      tap(processedItems => {
        console.log('Cart data received (processed):', processedItems);
        this.cartItemsSource.next(processedItems); // Update subject with processed items
      }),
      catchError(err => {
        if (err.status !== 401 && err.status !== 403) { console.error('Failed to fetch cart:', err); }
        this.cartItemsSource.next([]);
        return of([]);
      })
    ).subscribe();
  }

  /** Adds item to cart */
  addToCart(eventId: number, quantity: number = 1): void {
    const url = `${this.apiUrl}/cart/`;
    const payload = { id: eventId, quantity: quantity };
    this.http.post<OrderItem>(url, payload).pipe(
      tap(() => this.fetchCart()),
      catchError(this.handleError)
    ).subscribe({ error: (err) => alert(`Failed to add item: ${err.message}`) });
  }

  /** Removes item from cart */
  removeFromCart(bookingItemId: number): void {
    const url = `${this.apiUrl}/cart/${bookingItemId}/`;
    this.http.delete<void>(url).pipe(
      tap(() => this.fetchCart()),
      catchError(this.handleError)
    ).subscribe({ error: (err) => alert(`Failed to remove item: ${err.message}`) });
  }

  /** Clears cart */
  clearCart(): void {
    const currentItems = this.cartItemsSource.getValue();
    if (currentItems.length === 0) return;
    const deleteObservables = currentItems.map(item =>
      this.http.delete<void>(`${this.apiUrl}/cart/${item.id}/`).pipe(catchError(err => of(null)))
    );
    forkJoin(deleteObservables).subscribe(() => this.fetchCart());
  }

  /** Placeholder for placing order */
  placeOrder(): Observable<Order> {
    const url = `${this.apiUrl}/orders/create/`; // Hypothetical endpoint
    return this.http.post<Order>(url, {}).pipe(
      map(order => ({ // Convert date after placing order
        ...order,
        created_at_obj: order.created_at ? new Date(order.created_at) : undefined
      })),
      tap(placedOrder => {
        console.log('Order placed successfully:', placedOrder);
        this.fetchCart();
      }),
      catchError(err => {
        const message = err.status === 404 ? 'Order placement endpoint not found on backend.' : 'Failed to place order.';
        return throwError(() => new Error(message));
      })
    );
  }

  /** Fetches order history (Tickets) and converts dates */
  getOrderHistory(): Observable<Ticket[]> {
    const url = `${this.apiUrl}/tickets/`;
    return this.http.get<Ticket[]>(url).pipe( // Fetch directly as Ticket[]
      map(tickets => tickets.map(ticket => ({ // Convert dates within tickets
        ...ticket,
        booking_item: {
          ...ticket.booking_item,
          // Add Date object versions
          booking_date_obj: new Date(ticket.booking_item.booking_date),
          event: {
            ...ticket.booking_item.event,
            // Add Date object version
            // event_date_obj: new Date(ticket.booking_item.event.date)
          }
        }
      }))),
      catchError(this.handleError)
    );
  }

  /** Basic error handler */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    // --- FIX: Declare backendMessage before using it ---
    let backendMessage = '';
    // --- End Fix ---
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Network error: ${error.error.message}`;
    } else {
      if (error.error) {
        if (typeof error.error === 'string') {
          backendMessage = error.error;
        } else if (typeof error.error === 'object') {
          backendMessage = error.error.detail || error.error.error || JSON.stringify(error.error);
        }
      }
      errorMessage = `Backend Error (Status ${error.status}): ${backendMessage || error.message}`;
    }
    console.error('ApiService Error:', errorMessage);
    // Use the extracted backendMessage if available
    return throwError(() => new Error(`Operation failed: ${backendMessage || 'Please try again later.'}`));
  }
}
