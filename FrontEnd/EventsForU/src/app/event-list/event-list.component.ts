// eventsforu/frontend/src/app/event-list/event-list.component.ts
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../cart.service';
import { Event } from '../models/event.model'; // <--- Change this import

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit, OnChanges {

  @Input() eventsToShow: Event[] = []; // Now uses the new Event type

  sortedEvents: Event[] = [];

  // Ensure 'date' is a valid key in the new Event model for sorting
  currentSortKey: keyof Event | null = 'date';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.applySort();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['eventsToShow']) {
      this.applySort();
    }
  }

  // Ensure 'key' is a valid property of the new Event model
  sortEvents(key: keyof Event): void {
    // Check if the key exists on the Event model if necessary,
    // although 'name' and 'date' are present.
    if (this.currentSortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSortKey = key;
      this.sortDirection = 'asc';
    }
    this.applySort();
  }
// In eventsforu/frontend/src/app/event-list/event-list.component.ts
// Inside the EventListComponent class

  private applySort(): void {
    let sorted = [...this.eventsToShow];

    if (this.currentSortKey) {
      // Check if the key exists on the Event model if necessary
      if (sorted.length > 0 && !(this.currentSortKey in sorted[0])) {
        console.warn(`Cannot sort by key "${this.currentSortKey}" as it doesn't exist on the Event model.`);
        this.currentSortKey = null; // Reset sort key
      } else {
        sorted.sort((a, b) => {
          const valA = a[this.currentSortKey!];
          const valB = b[this.currentSortKey!];

          let comparison = 0;
          // Add null/undefined checks for robust comparison
          const valAExists = valA !== null && typeof valA !== 'undefined';
          const valBExists = valB !== null && typeof valB !== 'undefined';

          if (valAExists && valBExists) {
            if (valA > valB) comparison = 1;
            else if (valA < valB) comparison = -1;
          } else if (valAExists) {
            comparison = 1; // Treat existing value as greater
          } else if (valBExists) {
            comparison = -1; // Treat existing value as greater
          }
          // else comparison remains 0 if both are null/undefined

          return this.sortDirection === 'asc' ? comparison : comparison * -1;
        });
      }
    }
    this.sortedEvents = sorted;
  }

  // This function might need adjustment later depending on how
  // CartService is updated (if it also needs the new Event model).
  addToCart(event: Event): void {
    this.cartService.addToCart(event);
    // Consider providing more feedback or using a snackbar component
    alert(`${event.name} has been added to your cart.`);
  }
}
