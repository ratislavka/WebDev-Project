import { Routes } from '@angular/router';
import { EventListComponent } from './event-list/event-list.component';
import { EventDetailsComponent } from './event-details/event-details.component';

export const routes: Routes = [
  { path: '', component: EventListComponent },
  { path: 'event/:id', component: EventDetailsComponent },
];
