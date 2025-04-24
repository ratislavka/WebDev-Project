import { OrderItem } from './order-item.model';

export interface Order {
  id: string;
  date: Date;
  items: OrderItem[];
  totalAmount: number;
}
