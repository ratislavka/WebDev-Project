import { Component } from '@angular/core';
import { Event, EVENTS } from '../data';
import { CartService } from '../cart.service';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  imports: [
    RouterLink
  ],
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent {
  events: Event[] = EVENTS;

  constructor(private cartService: CartService) {}

  addToCart(event: Event): void {
    this.cartService.addToCart(event);
    alert(`${event.name} has been added to your cart.`);
  }
}
