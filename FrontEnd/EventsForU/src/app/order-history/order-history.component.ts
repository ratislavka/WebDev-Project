// eventsforu/frontend/src/app/order-history/order-history.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Keep CommonModule
// Remove CartService and Order imports
import { EventService } from '../event.service'; // Import EventService instead
import { Ticket } from '../models/ticket.model'; // Import the new Ticket model
import { AuthService } from '../auth.service'; // Optional: Inject Auth to check status

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  // Use the new Ticket model type
  orderHistory: Ticket[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;

  // Inject EventService (and optionally AuthService)
  constructor(
      private eventService: EventService,
      private authService: AuthService // Optional check
  ) { }

  ngOnInit(): void {
    // Optional: Check if user is authenticated before fetching
    if (!this.authService.getIsAuthenticated()) {
      this.isLoading = false;
      this.errorMessage = "Please log in to view your order history.";
      console.warn("Order history: User not logged in.");
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
        // Optional: Sort tickets if needed (e.g., by booking_item.booking_date)
        this.orderHistory.sort((a, b) =>
            new Date(b.booking_item.booking_date).getTime() - new Date(a.booking_item.booking_date).getTime()
        );
        this.isLoading = false;
        console.log('Order history loaded:', this.orderHistory);
      },
      error: (err) => {
        console.error('Failed to load order history:', err);
        this.errorMessage = `Could not load order history. ${err.message || 'Please try again later.'}`;
        this.isLoading = false;
        this.orderHistory = []; // Ensure array is empty on error
      }
    });
  }

  // Optional: Track tickets by a unique identifier if available
  // Using booking_item.id might work if it's unique per ticket display
  trackByTicketId(index: number, ticket: Ticket): number {
    return ticket.booking_item.id;
  }
}
