import { Event } from './event.model';


export interface BookingItem {
  id: number;
  event: Event;
  booking_date: string;
  quantity: number;
  total: number;
  customer: any;
}
