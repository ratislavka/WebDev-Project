// eventsforu/frontend/src/app/cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
// Use the new Event model for type consistency going forward
import { Event } from './models/event.model'; // <--- Change this import

// Keep OrderItem and Order as they define the structure for orders/cart display
// If these also relied heavily on fields only in the old Event model, they might need adjustment too.
export interface OrderItem {
  eventId: number;
  name: string;
  price: number;
  quantity: number;
  // Add/remove properties if needed based on the new Event model
  // e.g., maybe location instead of description?
  location?: string; // Example: Add location if needed in cart/order display
}

export interface Order {
  id: string;
  date: Date;
  items: OrderItem[];
  totalAmount: number;
}


@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly ORDERS_STORAGE_KEY = 'eventAppOrders';
  private readonly CART_STORAGE_KEY = 'eventAppCart';

  // IMPORTANT: The items stored in localStorage via CART_STORAGE_KEY
  // are likely still in the OLD Event format from data.ts based on the previous code.
  // This BehaviorSubject will load OLD data initially.
  // We need a strategy to migrate or handle this discrepancy later.
  private itemsSubject = new BehaviorSubject<any[]>(this.getCartItemsFromStorage()); // Use any[] temporarily
  items$: Observable<any[]> = this.itemsSubject.asObservable();

  constructor() {}

  // --- Cart Management ---

  // This retrieves potentially OLD format items from storage
  private getCartItemsFromStorage(): any[] { // Use any[] temporarily
    try {
      const itemsJson = localStorage.getItem(this.CART_STORAGE_KEY);
      // We don't know for sure if itemsJson contains old or new format
      return itemsJson ? JSON.parse(itemsJson) : [];
    } catch (e) {
      console.error("Error reading cart items from local storage", e);
      return [];
    }
  }

  // This saves items (potentially mixed format now) back to storage
  private saveCartItemsToStorage(items: any[]): void { // Use any[] temporarily
    try {
      localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Error saving cart items to local storage", e);
    }
  }

  // Modify addToCart to accept the NEW Event type
  addToCart(event: Event): void { // <--- Accepts NEW Event type
    const currentItems = this.itemsSubject.getValue();
    // Add the new event object directly.
    // Note: Now currentItems might contain a mix of old and new event structures
    // if the user had items in the cart before this change. Needs proper handling later.
    const updatedItems = [...currentItems, event];
    this.itemsSubject.next(updatedItems);
    this.saveCartItemsToStorage(updatedItems);
  }

  // This method might break or give unexpected results if itemsSubject contains
  // a mix of old/new structures, or if the required properties (id, name, price)
  // differ significantly.
  getGroupedCartItems(): OrderItem[] {
    const items = this.itemsSubject.getValue(); // Contains potentially mixed items
    const grouped: { [key: number]: OrderItem } = {};

    items.forEach(item => {
      // Try to access properties common to both old and new Event types (id, name, price)
      const eventId = item?.id;
      if (typeof eventId !== 'number') return; // Skip if item has no valid id

      if (grouped[eventId]) {
        grouped[eventId].quantity++;
      } else {
        // Create OrderItem using properties from the new Event model where possible
        grouped[eventId] = {
          eventId: item.id,
          name: item.name ?? 'Unknown Event', // Use nullish coalescing for safety
          price: item.price ?? 0,
          quantity: 1,
          location: item.location // Example: include location if needed
        };
      }
    });
    return Object.values(grouped);
  }


  getCartTotal(): number {
    // This relies on getGroupedCartItems working correctly
    return this.getGroupedCartItems().reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  clearCart(): void {
    this.itemsSubject.next([]);
    localStorage.removeItem(this.CART_STORAGE_KEY);
  }

  // --- Order Management --- (Methods below likely need review too)

  private getOrdersFromStorage(): Order[] {
    // This assumes saved orders used the Order/OrderItem structure defined above.
    // If the structure of saved OrderItems needs changing based on the new Event,
    // this might need adjustment or data migration.
    try {
      const ordersJson = localStorage.getItem(this.ORDERS_STORAGE_KEY);
      if (ordersJson) {
        const parsedOrders = JSON.parse(ordersJson);
        return parsedOrders.map((order: any) => ({
          ...order,
          date: new Date(order.date)
        }));
      }
      return [];
    } catch (e) {
      console.error("Error reading orders from local storage", e);
      return [];
    }
  }

  private saveOrdersToStorage(orders: Order[]): void {
    try {
      localStorage.setItem(this.ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error("Error saving orders to local storage", e);
    }
  }

  placeOrder(): Order | null {
    // This relies on getGroupedCartItems and getCartTotal working correctly
    const cartItems = this.getGroupedCartItems();
    if (cartItems.length === 0) {
      console.warn("Cannot place an empty order.");
      return null;
    }

    const newOrder: Order = {
      id: `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      date: new Date(),
      items: cartItems, // Items structure based on getGroupedCartItems
      totalAmount: this.getCartTotal()
    };

    const allOrders = this.getOrdersFromStorage();
    allOrders.push(newOrder);
    this.saveOrdersToStorage(allOrders);
    this.clearCart();

    console.log('Order placed:', newOrder);
    return newOrder;
  }

  getOrderHistory(): Order[] {
    return this.getOrdersFromStorage();
  }
}
