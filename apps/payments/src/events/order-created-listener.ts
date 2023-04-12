import { Listener, OrderCreatedEvent, Subjects } from "@nightwood/common";
import { Message } from "node-nats-streaming";
import { LISTENER_GROUP_NAME } from "../config/config";
import { Order } from "../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  readonly queueGroupName = LISTENER_GROUP_NAME;

  async onMessage(
    data: OrderCreatedEvent["data"],
    message: Message
  ): Promise<void> {
    const { id, status, item, userId, version } = data;
    const order = Order.build({
      id: id,
      price: item.price,
      status: status,
      userId: userId,
      version: version,
    });
    await order.save();
    message.ack();
  }
}
