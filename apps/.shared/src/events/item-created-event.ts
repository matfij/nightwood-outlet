import { Subjects } from "./subjects";

export interface ItemCreatedEvent {
  subject: Subjects.ItemCreated;
  data: {
    id: string;
    name: string;
    price: number;
    userId: string;
    version: number;
  };
}
