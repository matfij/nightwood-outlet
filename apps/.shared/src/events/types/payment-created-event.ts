import { Subjects } from "../definitions/subjects";

export interface PaymentCreatedEvent {
  subject: Subjects.PaymentCreated;
  data: {
    id: string;
    orderId: string;
    chargeId: string;
    version: number;
  };
}
