import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, Order } from '../cart.service';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  orders: Order[] = [];
  isLoading: boolean = true;
  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.loadOrderHistory();
  }

  loadOrderHistory(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.orders = this.cartService.getOrderHistory();
      // Sort orders by date, newest first
      this.orders.sort((a, b) => b.date.getTime() - a.date.getTime());
      this.isLoading = false;
    });
  }

  // Optional: Track orders by ID for *ngFor performance
  trackByOrderId(index: number, order: Order): string {
    return order.id;
  }
}
