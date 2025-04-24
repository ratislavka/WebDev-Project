import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Event } from './models/event.model';

// Interface for items within an order
export interface OrderItem {
  eventId: number;
  name: string;
  price: number;
  quantity: number;
  // Add/remove properties if needed based on the new Event model
  // e.g., maybe location instead of description?
  location?: string; // Example: Add location if needed in cart/order display
}
// Interface for the entire order
export interface Order {
  id: string; // Unique order ID
  date: Date; // Order placement timestamp
  items: OrderItem[];
  totalAmount: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // Key for storing orders in local storage
  private readonly ORDERS_STORAGE_KEY = 'eventAppOrders';
  // Key for storing cart items (assuming you might use this too)
  private readonly CART_STORAGE_KEY = 'eventAppCart';

  // Use BehaviorSubject to keep track of cart items
  // Initialize with items from local storage if they exist
  private itemsSubject = new BehaviorSubject<any[]>(this.getCartItemsFromStorage()); // Use any[] temporarily
  items$: Observable<any[]> = this.itemsSubject.asObservable();

  constructor() {
    // Optional: You could load orders here too if needed elsewhere immediately
  }

  // --- Cart Management ---

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

  private saveCartItemsToStorage(items: any[]): void { // Use any[] temporarily
    try {
      localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Error saving cart items to local storage", e);
    }
  }

  addToCart(event: Event): void { // <--- Accepts NEW Event type
    const currentItems = this.itemsSubject.getValue();
    // Add the new event object directly.
    // Note: Now currentItems might contain a mix of old and new event structures
    // if the user had items in the cart before this change. Needs proper handling later.
    const updatedItems = [...currentItems, event];
    this.itemsSubject.next(updatedItems);
    this.saveCartItemsToStorage(updatedItems);
  }

  getItems(): Event[] {
    return this.itemsSubject.getValue();
  }

  // Method to get items grouped with quantity (useful for cart display and order)
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

  // --- Order Management ---

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

  // Method to place a new order
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

  // Method to retrieve all past orders
  getOrderHistory(): Order[] {
    return this.getOrdersFromStorage();
  }
}
