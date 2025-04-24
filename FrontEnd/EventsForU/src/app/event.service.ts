// eventsforu/frontend/src/app/event.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, tap, throwError} from 'rxjs';
import { Event } from './models/event.model';
import {catchError} from "rxjs/operators";
import {Ticket} from "./models/ticket.model"; // Import the model created in Step 1

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
        return this.http.get<Event>(`${this.apiUrl}events/${id}/`);
    }

    getOrderHistory(): Observable<Ticket[]> {
        // Ensure you import the Ticket model at the top of the file:
        // import { Ticket } from './models/ticket.model';
        const ticketsUrl = `${this.apiUrl}tickets/`; // Correct endpoint

        console.log('Fetching order history from:', ticketsUrl);
        // Requires authentication, so send credentials
        return this.http.get<Ticket[]>(ticketsUrl, { withCredentials: true })
            .pipe(
                tap(tickets => console.log('Fetched order history:', tickets)),
                catchError(err => {
                    console.error('Error fetching order history:', err);
                    // Return an empty array or re-throw depending on how you want to handle errors
                    return throwError(() => err);
                    // Or: return of([]); // Return empty array on error
                })
            );
    }
}
