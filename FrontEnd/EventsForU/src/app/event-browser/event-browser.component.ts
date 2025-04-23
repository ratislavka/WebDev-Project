import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../cart.service';
import { Event } from '../event.service';


@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './event-browser.component.html',
  styleUrls: ['./event-browser.component.css']
})
export class EventListComponent implements OnInit, OnChanges {
  // --- Use the CORRECT Event interface for the input ---
  @Input() eventsToShow: Event[] = [];

  sortedEvents: Event[] = []; // Also use the correct Event type here
  // Use keyof Event for type safety, but allow string as fallback if needed
  currentSortKey: keyof Event | string | null = 'date';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.applySort();

  }

  ngOnChanges(changes: SimpleChanges): void {
    // Re-sort when the input array changes
    if (changes['eventsToShow']) {
      this.applySort();
    }
  }

  // Sort events based on the provided key
  sortEvents(key: keyof Event | string): void {
    const sortKey = key as keyof Event; // Cast to keyof Event
    if (this.currentSortKey === sortKey) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSortKey = sortKey;
      this.sortDirection = 'asc';
    }
    this.applySort();
  }

  // Apply sorting logic to the eventsToShow array
  private applySort(): void {
    let sorted = [...this.eventsToShow]; // Create a copy to sort
    const keyToSort = this.currentSortKey as keyof Event | null; // Ensure key is valid

    if (keyToSort) {
      sorted.sort((a, b) => {
        // Handle potential undefined values safely
        const valA = a[keyToSort] ?? ''; // Use nullish coalescing
        const valB = b[keyToSort] ?? '';

        let comparison = 0;
        // Basic comparison, adjust for specific types like dates if needed
        if (valA > valB) { comparison = 1; }
        else if (valA < valB) { comparison = -1; }

        return this.sortDirection === 'asc' ? comparison : comparison * -1;
      });
    }
    this.sortedEvents = sorted; // Update the array used by the template
  }

  // Add event to cart using its ID
  addToCart(event: Event): void {
    if (event && event.id) {
      this.cartService.addToCart(event.id, 1); // Pass event ID
      alert(`${event.name} added to cart!`);
    } else {
      console.error("Cannot add to cart, invalid event data or ID.");
    }
  }
}

export class EventBrowserComponent {
}
