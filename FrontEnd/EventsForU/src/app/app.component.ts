import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import { EventListComponent } from './event-list/event-list.component';

import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, EventListComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'EventsForU';

  isAuthenticated$: Observable<boolean>;

  constructor(
      private authService: AuthService,
      private router: Router
  ) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
  }


  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.router.navigate(['/login']);
      }
    });
  }

}
