import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService, OrderItem, Order } from '../cart.service'; // Ensure OrderItem is imported
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  // Use observables directly from the service
  cartItems$: Observable<OrderItem[]>;
  cartTotal$: Observable<number>;

  orderPlacedMessage: string | null = null;
  placedOrderId: string | number | null = null;
  isPlacingOrder: boolean = false;
  placementError: string | null = null;

  // --- FIX: Inject CartService ---
  constructor(
    public cartService: CartService, // Make public if using in template (e.g., for remove button)
    private router: Router
  ) {
    // Assign observables directly from the service
    this.cartItems$ = this.cartService.items$;
    this.cartTotal$ = this.cartService.cartTotal$;
    // --- REMOVE lines calling getGroupedCartItems/getCartTotal ---
  }

  ngOnInit(): void { }

  handlePlaceOrder(): void {
    this.isPlacingOrder = true;
    this.orderPlacedMessage = null;
    this.placementError = null;
    this.placedOrderId = null;

    // --- FIX: Subscribe correctly ---
    this.cartService.placeOrder().subscribe({
      next: (placedOrder: Order) => {
        this.isPlacingOrder = false;
        this.placedOrderId = placedOrder.id; // Access id from the RESULT
        this.orderPlacedMessage = `Order successfully placed! Your order ID is ${placedOrder.id}.`;
      },
      error: (err: Error) => {
        this.isPlacingOrder = false;
        this.placementError = `Failed to place order: ${err.message}`;
      }
    });
  }

  handleClearCart(): void {
    this.cartService.clearCart();
    this.orderPlacedMessage = null;
    this.placementError = null;
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  // --- FIX: Use item.id (BookingItem ID) ---
  trackByItemId(index: number, item: OrderItem): number {
    return item.id;
  }
}
