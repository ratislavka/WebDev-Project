import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

import { EventService } from '../event.service';
import { CartService } from '../cart.service';
import { Event } from '../models/event.model';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {
  event: Event | undefined;
  isLoading: boolean = true;

  constructor(
      private route: ActivatedRoute,
      private cartService: CartService,
      private eventService: EventService
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
          this.event = fetchedEvent;
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          this.event = undefined;
        }
      });
    } else {
      console.error('Event ID not found in route parameters');
      this.isLoading = false;
    }
  }

  addToCart(): void {
    if (this.event) {
      this.cartService.addToCart(this.event);
      alert(`${this.event.name} has been added to your cart.`);
    } else {
      alert('Cannot add to cart: Event data not available.');
    }
  }
}
