import { Routes } from '@angular/router';
import { EventListComponent } from './event-list/event-list.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { LoginComponent } from './login/login.component';
import { CartComponent } from './cart/cart.component';

export const routes: Routes = [
  { path: '', component: EventListComponent },
  { path: 'event/:id', component: EventDetailsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'cart', component: CartComponent }
];
