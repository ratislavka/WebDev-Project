import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { RouterModule } from '@angular/router'; // If using routerLink
import { CartService, OrderItem, Order } from '../cart.service'; // Import service and interfaces
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule], // Add CommonModule
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  // Use grouped items for display
  cartItems$: Observable<OrderItem[]>;
  cartTotal$: Observable<number>;
  orderPlacedMessage: string | null = null;
  placedOrderId: string | null = null;

  constructor(private cartService: CartService) {
    // Initialize observables directly from service methods/properties
    // We need grouped items and total for the cart view
    this.cartItems$ = this.cartService.items$.pipe(
      map(() => this.cartService.getGroupedCartItems()) // Recalculate grouped items when source changes
    );
    this.cartTotal$ = this.cartService.items$.pipe(
      map(() => this.cartService.getCartTotal()) // Recalculate total when source changes
    );
  }

  ngOnInit(): void {
    // Observables handle updates automatically
  }

  // Method to handle placing the order
  handlePlaceOrder(): void {
    const placedOrder = this.cartService.placeOrder();
    if (placedOrder) {
      this.orderPlacedMessage = `Order successfully placed! Your order ID is ${placedOrder.id}.`;
      this.placedOrderId = placedOrder.id;
      // Optionally clear message after a few seconds
      setTimeout(() => {
        this.orderPlacedMessage = null;
        this.placedOrderId = null;
      }, 5000); // Hide after 5 seconds
    } else {
      // Handle case where order couldn't be placed (e.g., empty cart)
      this.orderPlacedMessage = 'Your cart is empty. Cannot place order.';
      setTimeout(() => this.orderPlacedMessage = null, 3000);
    }
  }

  // Optional: Method to clear the cart manually
  handleClearCart(): void {
    this.cartService.clearCart();
    this.orderPlacedMessage = null; // Clear any previous messages
  }

  // Optional: Track items by ID for *ngFor performance
  trackByItemId(index: number, item: OrderItem): number {
    return item.eventId;
  }
}
