// eventsforu/frontend/src/app/event.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Import HttpHeaders
import { Observable, throwError, of } from 'rxjs'; // Import throwError/of if using them in error handling
import { catchError, tap } from 'rxjs/operators';

import { Event } from './models/event.model';
import { Ticket } from './models/ticket.model'; // Import Ticket model

// Helper function (ensure this is defined outside the class)
function getCookie(name: string): string | null {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

@Injectable({
    providedIn: 'root'
})
export class EventService {

    private apiUrl = 'http://localhost:8000/api/';

    constructor(private http: HttpClient) {}

    getEvents(): Observable<Event[]> {
        return this.http.get<Event[]>(`${this.apiUrl}events/`);
    }

    getEventById(id: number): Observable<Event> {
        // Ensure this uses backticks and correct interpolation
        return this.http.get<Event>(`${this.apiUrl}events/${id}/`);
    }

    /**
     * Fetches the user's tickets (order history) from the backend.
     * Corresponds to GET /api/tickets/
     * Requires user to be authenticated.
     * @returns An Observable array of Ticket objects.
     */
    getOrderHistory(): Observable<Ticket[]> {
        const ticketsUrl = `${this.apiUrl}tickets/`;
        console.log('Fetching order history from:', ticketsUrl);
        // Remove headers - not needed for GET if auth cookie works
        return this.http.get<Ticket[]>(ticketsUrl, { withCredentials: true }) // Just send credentials
            .pipe(
                tap(tickets => console.log('Fetched order history:', tickets)),
                catchError(err => {
                    console.error('Error fetching order history:', err);
                    return throwError(() => err);
                })
            );
    }


}
