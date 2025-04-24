// eventsforu/frontend/src/app/models/booking-item.model.ts
import { Event } from './event.model'; // Import the Event model we created earlier

// Interface based on api/serializers.py -> BookingItemSerializer
export interface BookingItem {
  id: number; // ID of the BookingItem itself
  event: Event; // Nested Event data based on EventSerializer
  booking_date: string; // DateTimeField usually serializes to string
  quantity: number;
  total: number; // From SerializerMethodField get_total
  // We might not need cart_model and cart_items directly from the serializer
  // on the frontend, as we can calculate them if needed.
  // customer: any; // Customer details might be included, define if needed
}
