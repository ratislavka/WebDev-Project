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

  // Use the new cartItems$ observable which emits BookingItem[]
  cartItems$: Observable<BookingItem[]>;
  cartTotal$: Observable<number>;
  isLoading$: Observable<boolean>; // Use loading state from service
  orderPlacedMessage: string | null = null;
  // placedOrderId: string | null = null; // Backend 'buy' action doesn't return order ID

  private cartSub?: Subscription; // To manage subscription

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
    // Optional: Explicitly fetch cart if needed, though service fetches on auth change
    // this.cartService.fetchCart();

    // Example of subscribing if you need to react to cart changes directly
    // this.cartSub = this.cartItems$.subscribe(items => {
    //   console.log('CartComponent received updated items:', items);
    // });
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
        // Cannot get order ID directly from this response
        // Maybe navigate to order history?
        // Set timeout to clear message
        setTimeout(() => { this.orderPlacedMessage = null; }, 5000);
      },
      error: (err) => {
        this.orderPlacedMessage = `Order placement failed: ${err.message || 'Please try again.'}`;
        // Set timeout to clear error message
        setTimeout(() => { this.orderPlacedMessage = null; }, 5000);
      }
    });
  }

  // Note: clearCart was removed from service as it needs backend implementation
  // handleClearCart(): void {
  //   // this.cartService.clearCart(); // This method doesn't exist currently
  //   alert('Clear Cart functionality not yet implemented.');
  //   this.orderPlacedMessage = null;
  // }

  // Optional: Track items by ID for *ngFor performance
  trackByBookingItemId(index: number, item: BookingItem): number {
    return item.id; // Use BookingItem id
  }
}
