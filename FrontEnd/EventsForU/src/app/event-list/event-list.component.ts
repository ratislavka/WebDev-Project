import { Category, Event, EventDate, EVENTS } from '../data'; // Assuming these imports are correct
import { CartService } from '../cart.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core'; // Removed OnChanges, SimpleChanges unless needed elsewhere

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, RouterModule], // Ensure CommonModule is imported for *ngFor, *ngIf etc.
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit { // Implemented OnInit for potential initial setup if needed

  @Input() category: Category | null = null;
  @Input() date: EventDate | null = null;

  // Original source of events
  allEvents: Event[] = EVENTS;

  // Sorting state properties
  currentSortKey: keyof Event | null = 'date'; // Default sort key (use 'keyof Event' for type safety if Event type is well-defined)
  sortDirection: 'asc' | 'desc' = 'asc'; // Default sort direction

  // Getter that now filters AND sorts the events
  get filteredEvents(): Event[] {
    // 1. Filter events based on category and date inputs
    let filtered = this.allEvents.filter(e =>
      (!this.category || e.category === this.category) &&
      (!this.date     || e.date     === this.date) // Assuming direct comparison works for EventDate
    );

    // 2. Sort the filtered events if a sort key is set
    if (this.currentSortKey) {
      filtered.sort((a, b) => {
        // Use type assertion for safety if Event type is known
        const valA = a[this.currentSortKey!];
        const valB = b[this.currentSortKey!];

        let comparison = 0;

        // Basic comparison (adjust if dates or other types need specific logic)
        if (valA > valB) {
          comparison = 1;
        } else if (valA < valB) {
          comparison = -1;
        }

        return this.sortDirection === 'asc' ? comparison : comparison * -1; // Apply direction
      });
    }

    return filtered;
  }

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    // You could perform initial setup here if necessary
    // The getter `filteredEvents` handles initial filtering/sorting automatically
  }

  // Method to set sorting parameters, called by template buttons
  sortEvents(key: keyof Event): void {
    if (this.currentSortKey === key) {
      // Toggle direction if sorting by the same key
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Set new key and default direction
      this.currentSortKey = key;
      this.sortDirection = 'asc';
    }
    // No need to call a separate sort function, the getter will re-evaluate
  }

  // Add to cart functionality (remains the same)
  addToCart(event: Event): void {
    this.cartService.addToCart(event);
    // Consider using a more user-friendly notification than alert()
    // e.g., a snackbar or toast message
    alert(`${event.name} has been added to your cart.`);
  }
}

// Add a basic Event interface/type if you don't have one,
// helps with type safety (replace 'any' properties with actual types)
// export interface Event {
//   id: number;
//   name: string;
//   date: any; // Use specific type like Date or string or EventDate
//   place: string;
//   image: string;
//   category: any; // Use specific type like Category
//   price?: number; // Optional price example
//   // Add other relevant properties
// }
