// eventsforu/frontend/src/app/models/order-item.model.ts
export interface OrderItem {
  eventId: number;
  name: string;
  price: number;
  quantity: number;
  location?: string;
}
