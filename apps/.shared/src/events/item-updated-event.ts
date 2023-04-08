import { Subjects } from "./subjects";

export interface ItemUpdatedEvent {
  subject: Subjects.ItemUpdated;
  data: {
    id: string;
    name: string;
    price: number;
    userId: string;
    orderId?: string;
    version: number;
  };
}
