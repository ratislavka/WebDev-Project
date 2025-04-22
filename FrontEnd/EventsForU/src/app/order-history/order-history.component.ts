import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { CartService, Order } from '../cart.service'; // Import service and Order interface

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule], // Add CommonModule for *ngFor, pipes etc.
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  orders: Order[] = [];
  isLoading: boolean = true; // Optional loading state

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.loadOrderHistory();
  }

  loadOrderHistory(): void {
    this.isLoading = true;
    // Simulate potential async loading if needed in future
    setTimeout(() => {
      this.orders = this.cartService.getOrderHistory();
      // Sort orders by date, newest first
      this.orders.sort((a, b) => b.date.getTime() - a.date.getTime());
      this.isLoading = false;
      console.log('Loaded orders:', this.orders); // For debugging
    }, 100); // Small delay to show loading state if desired
  }

  // Optional: Track orders by ID for *ngFor performance
  trackByOrderId(index: number, order: Order): string {
    return order.id;
  }
}
