import { Subjects } from "../definitions/subjects";

export interface OrderCancelledEvent {
  subject: Subjects.OrderCancelled;
  data: {
    id: string;
    version: number;
    item: {
      id: string;
    };
  };
}
