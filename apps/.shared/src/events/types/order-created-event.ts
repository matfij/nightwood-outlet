import { Subjects } from "../definitions/subjects";
import { OrderStatus } from "../definitions/orders";

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
