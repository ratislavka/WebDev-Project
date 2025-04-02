import { Injectable } from '@angular/core';
import { Event } from './data'; // Adjust the import path as necessary

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: Event[] = [];

  addToCart(event: Event): void {
    const existingEvent = this.cart.find(e => e.id === event.id);
    if (!existingEvent) {
      this.cart.push(event);
    }
  }

  removeFromCart(eventId: number): void {
    this.cart = this.cart.filter(e => e.id !== eventId);
  }

  getCart(): Event[] {
    return this.cart;
  }

  clearCart(): void {
    this.cart = [];
  }
}
