import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, Ticket } from '../cart.service'; // Import Ticket interface

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  // --- FIX: Use Ticket[] ---
  tickets: Ticket[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.loadOrderHistory();
  }

  loadOrderHistory(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.tickets = [];

    // --- FIX: Subscribe to the Observable ---
    this.cartService.getOrderHistory().subscribe({
      next: (fetchedTickets) => {
        // --- FIX: Sort using the converted booking_date_obj ---
        // Ensure booking_date_obj exists before sorting
        this.tickets = fetchedTickets.sort((a, b) => {
          const dateA = a.booking_item.booking_date_obj?.getTime() ?? 0;
          const dateB = b.booking_item.booking_date_obj?.getTime() ?? 0;
          return dateB - dateA; // Sort descending (newest first)
        });
        this.isLoading = false;
      },
      error: (err: Error) => {
        this.errorMessage = `Failed to load order history: ${err.message}`;
        this.isLoading = false;
      }
    });
  }

  // --- FIX: Return type number | string ---
  trackByTicketId(index: number, ticket: Ticket): number | string {
    return ticket.id;
  }
}
