import {Category, Event, EventDate, EVENTS} from '../data';
import { CartService } from '../cart.service';
import {CommonModule} from '@angular/common';
import { RouterModule } from '@angular/router';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';


@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent {
  @Input() category: Category | null = null;      // :contentReference[oaicite:0]{index=0}
  @Input() date: EventDate | null = null;         // :contentReference[oaicite:1]{index=1}
  events: Event[] = EVENTS;

  get filteredEvents(): Event[] {
    return EVENTS.filter(e =>
      (!this.category || e.category === this.category) &&
      (!this.date     || e.date     === this.date)
    );
  }

  constructor(private cartService: CartService) {}

  addToCart(event: Event): void {
    this.cartService.addToCart(event);
    alert(`${event.name} has been added to your cart.`);
  }
}
