import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Event, EVENTS } from '../data';
import { CartService } from '../cart.service';
import {CommonModule} from '@angular/common';
import {EventService} from '../event.service';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {
  event: Event | undefined;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.event = EVENTS.find(e => e.id === id);
  }

  addToCart(): void {
    if (this.event && this.event.id) { // Check if event and event.id exist
      // Pass only the event ID (number)
      this.cartService.addToCart(this.event.id, 1); // Add 1 quantity
      alert(`${this.event.name} added to cart!`); // Simple feedback
    } else {
      console.error("Cannot add to cart, event data or ID is missing.");
    }
  }
}
