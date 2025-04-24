import { BookingItem } from './booking-item.model';


interface CustomerInfo {
  id: number;
  user: {
    first_name: string;
    last_name: string;
    username: string;
  };
}


export interface Ticket {
  customer: CustomerInfo;
  booking_item: BookingItem;
}
