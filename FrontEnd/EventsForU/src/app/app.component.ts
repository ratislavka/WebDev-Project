// src/app/app.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CATEGORIES, Category } from './data';
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
  categories: Category[] = CATEGORIES;
  selectedCategory: Category | null = null;

  selectCategory(category: Category): void {
    // Add any filtering logic here if needed.
    this.selectedCategory = category;
  }
}
