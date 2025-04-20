import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category, EventDate } from './data';
import { EventListComponent } from './event-list/event-list.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, EventListComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'EventsForU';

  // Convert enums to arrays for iteration in templates
  categories = Object.values(Category);
  dates = Object.values(EventDate);

  selectedCategory: Category | null = null;
  selectedDate: EventDate | null = null;

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
