import { Listener, OrderCreatedEvent } from "@nightwood/common";
import { Subjects } from "@nightwood/common/dist/events/subjects";
import { Message } from "node-nats-streaming";
import { LISTENER_GROUP_NAME } from "../config/config";
import { expirationQueue } from "../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = LISTENER_GROUP_NAME;

  async onMessage(
    data: OrderCreatedEvent["data"],
    message: Message
  ): Promise<void> {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    await expirationQueue.add(
      {
        orderId: data.id,
      },
      { delay: delay }
    );
    message.ack();
  }
}
