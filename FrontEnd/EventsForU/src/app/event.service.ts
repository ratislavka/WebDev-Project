// eventsforu/frontend/src/app/event.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from './models/event.model'; // Import the model created in Step 1

@Injectable({
    providedIn: 'root' // Makes the service available application-wide
})
export class EventService {

    // Base URL for your Django backend API
    // Adjust if your backend runs on a different port or path
    private apiUrl = 'http://localhost:8000/api/';

    // Inject Angular's HttpClient module to make HTTP requests
    constructor(private http: HttpClient) {}

    /**
     * Fetches all events from the backend.
     * Corresponds to GET /api/events/
     * @returns An Observable array of Event objects.
     */
    getEvents(): Observable<Event[]> {
        return this.http.get<Event[]>(`${this.apiUrl}events/`);
    }

    /**
     * Fetches a single event by its ID from the backend.
     * Corresponds to GET /api/events/{id}/
     * @param id The ID of the event to fetch.
     * @returns An Observable containing the single Event object.
     */
    getEventById(id: number): Observable<Event> {
        return this.http.get<Event>(`<span class="math-inline">\{this\.apiUrl\}events/</span>{id}/`);
    }
}
