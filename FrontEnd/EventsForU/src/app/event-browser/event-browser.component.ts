// eventsforu/frontend/src/app/event-browser/event-browser.component.ts
import { Component, OnInit } from '@angular/core'; // Import OnInit
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventListComponent } from '../event-list/event-list.component';
import { EventService } from '../event.service'; // Import the EventService
import { Event } from '../models/event.model'; // Import the new Event model
import { Category, EventDate } from '../data'; // Keep Category/EventDate if used for filtering UI

@Component({
  selector: 'app-event-browser',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    EventListComponent
  ],
  templateUrl: './event-browser.component.html',
  styleUrls: ['./event-browser.component.css']
})
export class EventBrowserComponent implements OnInit { // Implement OnInit

  // Filter state properties (remain the same)
  selectedCategory: Category | null = null;
  selectedDate: EventDate | null = null;
  searchTerm: string = '';

  // Make categories, dates available (remain the same if UI uses them)
  availableCategories = Object.values(Category);
  availableDates = Object.values(EventDate);

  // Property to store events fetched from the backend
  allEvents: Event[] = [];
  isLoading: boolean = true; // Optional: Add loading indicator

  // Inject EventService
  constructor(private eventService: EventService) { }

  // Fetch events when the component initializes
  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.isLoading = true;
    this.eventService.getEvents().subscribe({
      next: (events) => {
        this.allEvents = events;
        this.isLoading = false;
        console.log('Events loaded from backend:', this.allEvents); // For debugging
        // Note: Filtering/sorting will happen automatically via the getter
      },
      error: (err) => {
        console.error('Error fetching events:', err);
        this.isLoading = false;
        // Handle error display for the user if needed
      }
    });
  }

  // Getter computes the filtered list based on fetched events
  get filteredEvents(): Event[] {
    let events = this.allEvents; // Use fetched events

    // --- Filter by Category ---
    // Your current logic requires the backend data to have a 'category' field
    // matching the Category enum. If your backend Event model/serializer doesn't
    // include 'category' in a way that matches the enum, you'll need to adjust
    // this filtering logic or update the backend/serializer.
    // For now, assuming the 'genre' field might map to Category:
    if (this.selectedCategory) {
      // Example adjustment: Filter based on genre matching category name
      events = events.filter(e => e.genre.toLowerCase() === this.selectedCategory!.toLowerCase());
    }

    // --- Filter by Date ---
    // Similar to Category, your current logic filters based on EventDate enum.
    // The backend provides date as a string (e.g., "2025-05-01").
    // You'll need to adjust how you filter by date. Maybe compare the
    // backend date string to a formatted version of the enum value, or
    // fetch distinct dates from the backend to populate the filter UI.
    // Simplified example (adjust as needed):
    if (this.selectedDate) {
      // This requires the EventDate enum values to match backend string format parts.
      // e.g., EventDate.May1 = 'May 1'. Adjust this comparison logic!
      // A more robust way would be to parse dates.
      events = events.filter(e => {
        // Example: Check if the backend date string contains the selected date string.
        // This is a basic example and might need refinement based on actual date formats.
        try {
          const eventDate = new Date(e.date);
          // Format EventDate enum value to match backend format if necessary
          // This comparison logic needs careful implementation based on your data
          // return e.date.includes(this.selectedDate!); // Example: Simple string check
          // Or compare parts of the date
          const monthDay = eventDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }); // e.g., "May 1"
          return monthDay === this.selectedDate; // Assuming EventDate enum matches this format
        } catch {
          return false; // Handle invalid date strings
        }
      });
    }

    // --- Filter by Search Term ---
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const lowerCaseSearchTerm = this.searchTerm.toLowerCase().trim();
      events = events.filter(e =>
          // Search in name and location (matches backend fields)
          e.name.toLowerCase().includes(lowerCaseSearchTerm) ||
          e.location.toLowerCase().includes(lowerCaseSearchTerm)
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
    this.selectedDate = null;
    this.searchTerm = '';
  }
}
