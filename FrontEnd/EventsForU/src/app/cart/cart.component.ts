// eventsforu/frontend/src/app/cart/cart.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../cart.service'; // Keep CartService import
import { BookingItem } from '../models/booking-item.model'; // Import the new BookingItem model
// Remove OrderItem/Order import from cart.service - they aren't used directly here now
import { Observable, Subscription } from 'rxjs'; // Import Subscription
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy { // Implement OnDestroy

  cartItems$: Observable<BookingItem[]>;
  cartTotal$: Observable<number>;
  isLoading$: Observable<boolean>;
  orderPlacedMessage: string | null = null;

  private cartSub?: Subscription;

  constructor(private cartService: CartService) {
    // Get observables directly from the service
    this.cartItems$ = this.cartService.cartItems$;
    this.isLoading$ = this.cartService.isLoading$;

    // Calculate total based on cartItems$ changes
    this.cartTotal$ = this.cartItems$.pipe(
        map(items => items.reduce((sum, item) => sum + (item.event.price * item.quantity), 0))
    );
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    this.cartSub?.unsubscribe();
  }


  // Method to handle placing the order
  handlePlaceOrder(): void {
    this.orderPlacedMessage = null; // Clear previous message
    // placedOrderId = null;

    // Call the service method which now returns Observable<{message: string}>
    this.cartService.placeOrder().subscribe({
      next: (response) => {
        // Backend returns a success message
        this.orderPlacedMessage = response.message || 'Order successfully placed!';
        setTimeout(() => { this.orderPlacedMessage = null; }, 5000);
      },
      error: (err) => {
        this.orderPlacedMessage = `Order placement failed: ${err.message || 'Please try again.'}`;
        setTimeout(() => { this.orderPlacedMessage = null; }, 5000);
      }
    });
  }


  trackByBookingItemId(index: number, item: BookingItem): number {
    return item.id;
  }
}
