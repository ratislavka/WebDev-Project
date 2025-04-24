// eventsforu/frontend/src/app/event-details/event-details.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common'; // Keep CommonModule for *ngIf etc.

import { EventService } from '../event.service'; // Import the service
import { CartService } from '../cart.service'; // Keep CartService import
import { Event } from '../models/event.model'; // <-- CORRECT Import for the new model

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule], // CommonModule is needed for *ngIf
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {
  event: Event | undefined; // Use the new Event model type
  isLoading: boolean = true; // Optional loading indicator

  constructor(
      private route: ActivatedRoute,
      private cartService: CartService,
      private eventService: EventService // Inject EventService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    // Get the 'id' parameter from the URL
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      // Fetch the event data using the service
      this.eventService.getEventById(id).subscribe({
        next: (fetchedEvent) => {
          this.event = fetchedEvent; // Store the fetched event
          this.isLoading = false;
          console.log('Event details loaded:', this.event); // For debugging
        },
        error: (err) => {
          console.error('Error fetching event details:', err);
          this.isLoading = false;
          this.event = undefined; // Ensure event is undefined on error
          // Handle error display for the user
        }
      });
    } else {
      console.error('Event ID not found in route parameters');
      this.isLoading = false;
      // Handle case where ID is missing
    }
  }

  addToCart(): void {
    // This should work now as this.event uses the new model,
    // and cartService.addToCart expects the new model.
    if (this.event) {
      this.cartService.addToCart(this.event);
      alert(`${this.event.name} has been added to your cart.`);
    } else {
      alert('Cannot add to cart: Event data not available.');
    }
  }
}
