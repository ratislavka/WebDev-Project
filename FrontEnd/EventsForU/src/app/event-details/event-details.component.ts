import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Event, EVENTS } from '../data';
import { CartService } from '../cart.service';
import {CommonModule} from '@angular/common';

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
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.event = EVENTS.find(e => e.id === id);
  }

  addToCart(): void {
    if (this.event) {
      this.cartService.addToCart(this.event);
      alert(`${this.event.name} has been added to your cart.`);
    }
  }
}
