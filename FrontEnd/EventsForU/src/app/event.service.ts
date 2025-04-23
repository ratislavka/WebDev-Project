import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../environments/environment'; // Uses correct path

// Interface matching your Event model and serializer
export interface Event {
  id: number;
  name: string;
  location: string;
  date: string; // Keep as string from JSON, format in component if needed
  duration: number;
  genre: string;
  price: number;
  image: string | null; // Image path relative to MEDIA_ROOT, can be null
  imageUrl?: string; // Optional: Full URL constructed in frontend
  // Add category if it's part of the Event serializer response
  category?: any; // Replace 'any' with actual type if available
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = environment.apiUrl;
  // Base URL of the backend (without /api) to construct full image URLs
  private backendBaseUrl = environment.apiUrl.replace('/api', ''); // Adjust if needed

  constructor(private http: HttpClient) { }

  /**
   * Fetches all events from the backend.
   * Endpoint: GET /api/events/
   */
  getEvents(): Observable<Event[]> {
    const url = `${this.apiUrl}/events/`;
    console.log('Fetching events from:', url);
    return this.http.get<Event[]>(url).pipe(
      map(events => events.map(event => this.addFullImageUrl(event))), // Add full image URL
      catchError(this.handleError)
    );
  }

  /**
   * Fetches a single event by its ID from the backend.
   * Endpoint: GET /api/events/{id}/
   */
  getEventById(id: number): Observable<Event> {
    const url = `${this.apiUrl}/events/${id}/`;
    console.log('Fetching event by ID from:', url);
    return this.http.get<Event>(url).pipe(
      map(event => this.addFullImageUrl(event)), // Add full image URL
      catchError(this.handleError)
    );
  }

  /** Helper function to construct the full image URL */
  private addFullImageUrl(event: Event): Event {
    if (event.image) {
      // Check if image path already contains '/media/' or starts with http
      if (event.image.startsWith('http')) {
        event.imageUrl = event.image; // Assume it's already a full URL
      } else if (event.image.startsWith('/media/')) {
        // If it starts with /media/, prepend backend base URL
        event.imageUrl = `${this.backendBaseUrl}${event.image}`;
      }
      else {
        // Otherwise, construct full URL assuming image path is relative to MEDIA_ROOT
        event.imageUrl = `${this.backendBaseUrl}/media/${event.image}`;
      }
    } else {
      // Provide a placeholder if no image exists
      event.imageUrl = 'https://placehold.co/600x400/eee/ccc?text=No+Image';
    }
    return event;
  }

  /** Basic error handler */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Network error: ${error.error.message}`;
    } else {
      errorMessage = `Backend returned code ${error.status}: ${error.message}`;
      if (error.error && typeof error.error === 'object') {
        errorMessage += `\nDetails: ${JSON.stringify(error.error)}`;
      } else if (error.error) {
        errorMessage += `\nBody: ${error.error}`;
      }
    }
    console.error('EventService Error:', errorMessage);
    return throwError(() => new Error('Failed to fetch event data. Please try again later.'));
  }
}
