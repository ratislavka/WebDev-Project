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
  currentSortKey: keyof Event | null = 'date'; // Default sort key
  sortDirection: 'asc' | 'desc' = 'asc'; // Default sort direction

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    // Initial sort when component loads
    this.applySort();
  }

  // Detect changes to the input property 'eventsToShow'
  ngOnChanges(changes: SimpleChanges): void {
    // If the eventsToShow input has changed, re-apply the sort
    if (changes['eventsToShow']) {
      // console.log('Input events changed, re-sorting...'); // For debugging
      this.applySort();
    }
  }

  // Method to set sorting parameters (remains the same)
  sortEvents(key: keyof Event): void {
    if (this.currentSortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSortKey = key;
      this.sortDirection = 'asc';
    }
    // Apply the sort based on the new state
    this.applySort();
  }

  // Method that performs the actual sorting logic
  // Now sorts the 'eventsToShow' input array
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
    // Update the internal array used by the template
    this.sortedEvents = sorted;
    // console.log('Sorted events:', this.sortedEvents); // For debugging
  }

  // Add to cart functionality (remains the same)
  addToCart(event: Event): void {
    this.cartService.addToCart(event);
    alert(`${event.name} has been added to your cart.`);
  }
}
