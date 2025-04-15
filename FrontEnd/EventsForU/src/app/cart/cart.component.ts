import { Component } from '@angular/core';
import { CartService } from '../cart.service';
import { Event } from '../data';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  imports: [
    NgForOf,
    NgIf
  ],
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  cart: Event[] = [];

  constructor(private cartService: CartService) {
    this.cart = this.cartService.getCart();
  }

  removeFromCart(eventId: number): void {
    this.cartService.removeFromCart(eventId);
    this.cart = this.cartService.getCart();
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.cart = [];
  }
}
