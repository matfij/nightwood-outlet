import { OrderCreatedEvent, Publisher, Subjects } from "@nightwood/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
