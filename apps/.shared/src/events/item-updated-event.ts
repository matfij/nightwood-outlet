import { Message } from "node-nats-streaming";
import { Subjects } from "./subjects";

export interface ItemUpdatedEvent {
  subject: Subjects.ItemUpdated;
  data: {
    id: string;
    name: string;
    price: number;
    userId: string;
  };
}
