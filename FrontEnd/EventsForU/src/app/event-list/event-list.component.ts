import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core'; // Added OnChanges, SimpleChanges
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../cart.service';
import { Event } from '../data'; // Import Event type/interface

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit, OnChanges { // Implement OnChanges

  // Input property to receive the filtered list from the parent
  @Input() eventsToShow: Event[] = [];

  // Internal property to hold the sorted list for display
  sortedEvents: Event[] = [];

  // Sorting state properties (remain the same)
  currentSortKey: keyof Event | null = 'date';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.applySort();
  }

  // Detect changes to the input property 'eventsToShow'
  ngOnChanges(changes: SimpleChanges): void {
    // If the eventsToShow input has changed, re-apply the sort
    if (changes['eventsToShow']) {
      this.applySort();
    }
  }

  sortEvents(key: keyof Event): void {
    if (this.currentSortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSortKey = key;
      this.sortDirection = 'asc';
    }
    this.applySort();
  }

  private applySort(): void {
    // Create a copy of the input array to avoid modifying it directly
    let sorted = [...this.eventsToShow];

    if (this.currentSortKey) {
      sorted.sort((a, b) => {
        const valA = a[this.currentSortKey!];
        const valB = b[this.currentSortKey!];

        let comparison = 0;
        if (valA > valB) {
          comparison = 1;
        } else if (valA < valB) {
          comparison = -1;
        }
        return this.sortDirection === 'asc' ? comparison : comparison * -1;
      });
    }
    this.sortedEvents = sorted;
  }


  addToCart(event: Event): void { // Method receives the specific event object
    if (event && event.id) { // Check if event and event.id exist
      // Pass only the event ID (number)
      this.cartService.addToCart(event.id, 1); // Add 1 quantity
      alert(`${event.name} added to cart!`); // Simple feedback
    } else {
      console.error("Cannot add to cart, invalid event data or ID.");
    }
  }
}
