// eventsforu/frontend/src/app/models/ticket.model.ts
import { BookingItem } from './booking-item.model';

// Simplified Customer model based on CustomerSerializer
interface CustomerInfo {
  id: number;
  user: { // Based on nested UserSerializer
    first_name: string;
    last_name: string;
    username: string;
  };
}

// Interface based on api/serializers.py -> TicketSerializer
export interface Ticket {
  // The serializer doesn't define a top-level ID for the Ticket itself
  // It includes nested customer and booking_item data
  customer: CustomerInfo;
  booking_item: BookingItem; // Use the BookingItem model we already defined
}
