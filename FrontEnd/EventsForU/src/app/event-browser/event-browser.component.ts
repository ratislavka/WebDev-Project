import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventListComponent } from '../event-list/event-list.component'; // Import child component
import { Category, EventDate} from '../data'; // Import your data/models

@Component({
  selector: 'app-event-browser',
  standalone: true,
  imports: [
    CommonModule, // Needed for *ngFor, *ngIf etc. in the template
    EventListComponent // Import the standalone EventListComponent
  ],
  templateUrl: './event-browser.component.html',
  styleUrls: ['./event-browser.component.css']
})
export class EventBrowserComponent {

  selectedCategory: Category | null = null;
  selectedDate: EventDate | null = null;

  // Make categories and dates available to the template for selection
  // Assuming CATEGORIES and EVENT_DATES are exported from your data file
  availableCategories = Object.values(Category);
  availableDates     = Object.values(EventDate);

  constructor() { }

  selectCategory(category: Category | null): void {
    this.selectedCategory = category;
  }

  selectDate(date: EventDate | null): void {
    this.selectedDate = date;
  }

  resetFilters(): void {
    this.selectedCategory = null;
    this.selectedDate   = null;
  }
}
