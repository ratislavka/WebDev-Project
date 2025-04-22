import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventListComponent } from '../event-list/event-list.component'; // Import child component
import { Category, EventDate, Event, EVENTS } from '../data';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-event-browser',
  standalone: true,
  imports: [
    CommonModule, // Needed for *ngFor, *ngIf etc. in the template
    EventListComponent,
    FormsModule,
    // Import the standalone EventListComponent
  ],
  templateUrl: './event-browser.component.html',
  styleUrls: ['./event-browser.component.css']
})
export class EventBrowserComponent {

  selectedCategory: Category | null = null;
  selectedDate: EventDate | null = null;
  searchTerm: string = ''; // Property to hold the search query

  // Make categories and dates available to the template for selection
  // Assuming CATEGORIES and EVENT_DATES are exported from your data file
  availableCategories = Object.values(Category);
  availableDates     = Object.values(EventDate);
  allEvents: Event[] = EVENTS; // Keep the master list here

  constructor() { }

  get filteredEvents(): Event[] {
    let events = this.allEvents;

    // 1. Filter by Category
    if (this.selectedCategory) {
      events = events.filter(e => e.category === this.selectedCategory);
    }

    // 2. Filter by Date
    if (this.selectedDate) {
      // Assuming direct comparison works. Adjust if date is complex object/needs range check
      events = events.filter(e => e.date === this.selectedDate);
    }

    // 3. Filter by Search Term (case-insensitive search in name and place)
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const lowerCaseSearchTerm = this.searchTerm.toLowerCase().trim();
      events = events.filter(e =>
          e.name.toLowerCase().includes(lowerCaseSearchTerm) ||
          e.place.toLowerCase().includes(lowerCaseSearchTerm)
        // Add more fields to search if needed (e.g., description)
        // || (e.description && e.description.toLowerCase().includes(lowerCaseSearchTerm))
      );
    }

    return events;
  }

  // --- Filter selection methods remain the same ---

  selectCategory(category: Category | null): void {
    this.selectedCategory = category;
  }

  selectDate(date: EventDate | null): void {
    this.selectedDate = date;
  }

  resetFilters(): void {
    this.selectedCategory = null;
    this.selectedDate   = null;
    this.searchTerm = ''; // Also reset search term
  }
}
