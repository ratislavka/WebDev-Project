// eventsforu/frontend/src/app/app.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Keep CommonModule
import {Router, RouterModule} from '@angular/router'; // Keep RouterModule
import { EventListComponent } from './event-list/event-list.component'; // Keep if needed directly here, else remove

import { AuthService } from './auth.service'; // Import AuthService
import { Observable } from 'rxjs'; // Import Observable

@Component({
  selector: 'app-root',
  standalone: true,
  // Add CommonModule if not already present (needed for async pipe and *ngIf)
  imports: [CommonModule, RouterModule, EventListComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'EventsForU';

  // Property to hold the observable for the template
  isAuthenticated$: Observable<boolean>;

  // Inject AuthService and Router (optional, for navigation on logout)
  constructor(
      private authService: AuthService,
      private router: Router // Optional: Inject Router if you want to navigate on logout
  ) {
    // Assign the observable from the service
    this.isAuthenticated$ = this.authService.isAuthenticated$;
  }

  // Method to handle logout
  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        // Check the state *synchronously* right after service call completes
        console.log('AppComponent: Logout subscribe() next called. Current auth state:', this.authService.getIsAuthenticated()); // <-- ADD THIS LOG
        console.log('Logout successful, navigating to login page.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Logout failed:', err);
        // Check the state even on error
        console.log('AppComponent: Logout subscribe() error called. Current auth state:', this.authService.getIsAuthenticated()); // <-- ADD THIS LOG
        this.router.navigate(['/login']);
      }
    });
  }

  // Removed categories/dates properties as they weren't used in the latest app.component.html
}
