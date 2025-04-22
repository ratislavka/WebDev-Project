import { Routes } from '@angular/router';
import { EventListComponent } from './event-list/event-list.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { LoginComponent } from './login/login.component';
import { CartComponent } from './cart/cart.component';
import {EventBrowserComponent} from './event-browser/event-browser.component';
import {OrderHistoryComponent} from './order-history/order-history.component';

export const routes: Routes = [
  //{ path: '', component: EventListComponent },
  { path: '', component: EventBrowserComponent },
  { path: 'event/:id', component: EventDetailsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'cart', component: CartComponent },
  { path: 'order-history', component: OrderHistoryComponent },
];
