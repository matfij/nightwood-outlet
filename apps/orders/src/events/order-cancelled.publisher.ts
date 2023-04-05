import { OrderCancelledEvent, Publisher, Subjects } from "@nightwood/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
