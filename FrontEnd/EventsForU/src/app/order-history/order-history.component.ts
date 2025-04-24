import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../event.service';
import { Ticket } from '../models/ticket.model';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  orderHistory: Ticket[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(
      private eventService: EventService,
      private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Optional: Check if user is authenticated before fetching
    if (!this.authService.getIsAuthenticated()) {
      this.isLoading = false;
      this.errorMessage = "Please log in to view your order history.";
      return;
    }
    this.loadOrderHistory();
  }

  loadOrderHistory(): void {
    this.isLoading = true;
    this.errorMessage = null; // Clear previous errors
    this.eventService.getOrderHistory().subscribe({ // Call the new method
      next: (tickets) => {
        this.orderHistory = tickets;
      },
      error: (err) => {
        this.errorMessage = `Could not load order history. ${err.message || 'Please try again later.'}`;
        this.isLoading = false;
        this.orderHistory = [];
      }
    });
  }

  trackByTicketId(index: number, ticket: Ticket): number {
    return ticket.booking_item.id;
  }
}
