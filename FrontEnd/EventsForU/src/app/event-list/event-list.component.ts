import { Component } from '@angular/core';
import { Event, EVENTS } from '../data';
import { CartService } from '../cart.service';
import {CommonModule} from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './event-list.component.html',
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
