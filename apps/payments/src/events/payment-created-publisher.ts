import { PaymentCreatedEvent, Publisher, Subjects } from "@nightwood/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
