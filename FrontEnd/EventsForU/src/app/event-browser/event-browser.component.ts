// eventsforu/frontend/src/app/event-browser/event-browser.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventListComponent } from '../event-list/event-list.component';
import { EventService } from '../event.service';
import { Event } from '../models/event.model';
// Remove Category/EventDate enum imports from '../data' if no longer needed

@Component({
  selector: 'app-event-browser',
  standalone: true,
  imports: [ CommonModule, FormsModule, EventListComponent ],
  templateUrl: './event-browser.component.html',
  styleUrls: ['./event-browser.component.css']
})
export class EventBrowserComponent implements OnInit {

  selectedGenre: string | null = null;
  selectedDate: string | null = null;
  searchTerm: string = '';

  // Properties to hold dynamic filter options
  availableGenres: string[] = [];
  availableDates: string[] = [];

  allEvents: Event[] = [];
  isLoading: boolean = true;

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.isLoading = true;
    this.eventService.getEvents().subscribe({
      next: (events) => {
        this.allEvents = events;
        this.isLoading = false;
        console.log('Events loaded from backend:', this.allEvents);
        // Generate dynamic filter options after loading events
        this.generateFilterOptions();
      },
      error: (err) => {
        console.error('Error fetching events:', err);
        this.isLoading = false;
      }
    });
  }

  generateFilterOptions(): void {
    // Extract unique genres
    const genres = this.allEvents.map(event => event.genre);
    this.availableGenres = [...new Set(genres)].sort(); // Unique, sorted genres

    // Extract unique dates
    const dates = this.allEvents.map(event => event.date);
    this.availableDates = [...new Set(dates)].sort(); // Unique, sorted date strings
  }

  // Getter computes the filtered list based on fetched events
  get filteredEvents(): Event[] {
    let events = this.allEvents;

    // Filter by Genre
    if (this.selectedGenre) {
      events = events.filter(e => e.genre === this.selectedGenre);
    }

    // Filter by Date
    if (this.selectedDate) {
      events = events.filter(e => e.date === this.selectedDate);
    }

    // Filter by Search Term
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const lowerCaseSearchTerm = this.searchTerm.toLowerCase().trim();
      events = events.filter(e =>
          e.name.toLowerCase().includes(lowerCaseSearchTerm) ||
          e.location.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    return events;
  }


  selectGenre(genre: string | null): void {
    this.selectedGenre = genre;
  }

  selectDate(date: string | null): void {
    this.selectedDate = date;
  }

  resetFilters(): void {
    this.selectedGenre = null;
    this.selectedDate = null;
    this.searchTerm = '';
  }
}
