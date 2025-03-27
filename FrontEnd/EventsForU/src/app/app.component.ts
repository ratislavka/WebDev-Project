import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CATEGORIES, Category, Event } from './data';
import {EventListComponent} from './event-list/event-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [EventListComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'EventsForU';
  categories: Category[] = CATEGORIES;
  selectedCategory: Category | null = null;

  selectCategory(category: Category): void {
    this.selectedCategory = category;
  }

}
