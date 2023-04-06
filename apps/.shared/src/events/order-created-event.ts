import { Subjects } from "./subjects";
import { OrderStatus } from "./types/orders";

export interface OrderCreatedEvent {
  subject: Subjects.OrderCreated;
  data: {
    id: string;
    status: OrderStatus;
    expiresAt: string;
    userId: string;
    version: number;
    item: {
      id: string;
      price: number;
    };
  };
}
