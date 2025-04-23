import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Event } from './data'; // Assuming Event interface exists

// Interface for items within an order
export interface OrderItem {
  eventId: number;
  name: string;
  price: number;
  quantity: number;
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
  private itemsSubject = new BehaviorSubject<Event[]>(this.getCartItemsFromStorage());
  items$: Observable<Event[]> = this.itemsSubject.asObservable();

  constructor() {
    // Optional: You could load orders here too if needed elsewhere immediately
  }

  // --- Cart Management ---

  private getCartItemsFromStorage(): Event[] {
    try {
      const itemsJson = localStorage.getItem(this.CART_STORAGE_KEY);
      return itemsJson ? JSON.parse(itemsJson) : [];
    } catch (e) {
      console.error("Error reading cart items from local storage", e);
      return [];
    }
  }

  private saveCartItemsToStorage(items: Event[]): void {
    try {
      localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Error saving cart items to local storage", e);
    }
  }

  addToCart(event: Event): void {
    const currentItems = this.itemsSubject.getValue();
    // Basic add - assumes 1 quantity per add click.
    // You might want quantity logic here if not already implemented.
    const updatedItems = [...currentItems, event];
    this.itemsSubject.next(updatedItems);
    this.saveCartItemsToStorage(updatedItems); // Save cart to storage
  }

  getItems(): Event[] {
    return this.itemsSubject.getValue();
  }

  // Method to get items grouped with quantity (useful for cart display and order)
  getGroupedCartItems(): OrderItem[] {
    const items = this.getItems();
    const grouped: { [key: number]: OrderItem } = {};

    items.forEach(item => {
      if (grouped[item.id]) {
        grouped[item.id].quantity++;
      } else {
        grouped[item.id] = {
          eventId: item.id,
          name: item.name,
          price: item.price || 0, // Assuming price exists, add default if needed
          quantity: 1
        };
      }
    });
    return Object.values(grouped);
  }

  getCartTotal(): number {
    return this.getGroupedCartItems().reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  clearCart(): void {
    this.itemsSubject.next([]);
    localStorage.removeItem(this.CART_STORAGE_KEY); // Clear cart from storage
  }

  // --- Order Management ---

  private getOrdersFromStorage(): Order[] {
    try {
      const ordersJson = localStorage.getItem(this.ORDERS_STORAGE_KEY);
      if (ordersJson) {
        // Need to parse dates correctly
        const parsedOrders = JSON.parse(ordersJson);
        return parsedOrders.map((order: any) => ({
          ...order,
          date: new Date(order.date) // Convert string date back to Date object
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
    const cartItems = this.getGroupedCartItems();
    if (cartItems.length === 0) {
      console.warn("Cannot place an empty order.");
      return null; // Or throw an error
    }

    const newOrder: Order = {
      id: `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`, // Simple unique ID
      date: new Date(),
      items: cartItems,
      totalAmount: this.getCartTotal()
    };

    // Retrieve existing orders, add the new one, and save back
    const allOrders = this.getOrdersFromStorage();
    allOrders.push(newOrder);
    this.saveOrdersToStorage(allOrders);

    // Clear the cart after placing the order
    this.clearCart();

    console.log('Order placed:', newOrder); // For debugging
    return newOrder;
  }

  // Method to retrieve all past orders
  getOrderHistory(): Order[] {
    return this.getOrdersFromStorage();
  }
}
