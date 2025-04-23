import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel
import { EventListComponent } from '../event-list/event-list.component';
import { Category, Event, EventDate, EVENTS } from '../data'; // Import EVENTS

@Component({
  selector: 'app-event-browser',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, // Add FormsModule here
    EventListComponent
  ],
  templateUrl: './event-browser.component.html',
  styleUrls: ['./event-browser.component.css']
})
export class EventBrowserComponent {

  // Filter state properties
  selectedCategory: Category | null = null;
  selectedDate: EventDate | null = null;
  searchTerm: string = '';

  // Make categories, dates, and all events available
  availableCategories = Object.values(Category);
  availableDates     = Object.values(EventDate);
  allEvents: Event[] = EVENTS;

  constructor() { }

  // Getter to compute the filtered list based on all criteria
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
      );
    }

    return events;
  }

  selectCategory(category: Category | null): void {
    this.selectedCategory = category;
  }

  selectDate(date: EventDate | null): void {
    this.selectedDate = date;
  }

  resetFilters(): void {
    this.selectedCategory = null;
    this.selectedDate   = null;
    this.searchTerm = '';
  }
}
