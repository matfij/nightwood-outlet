import {
  ExpirationCompleteEvent,
  Listener,
  OrderStatus,
  Subjects,
} from "@nightwood/common";
import { LISTENER_GROUP_NAME } from "../config/config";
import { Message } from "node-nats-streaming";
import { Order } from "../mongo/orders.schema";
import { OrderCancelledPublisher } from "./order-cancelled.publisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
  queueGroupName = LISTENER_GROUP_NAME;

  async onMessage(
    data: ExpirationCompleteEvent["data"],
    message: Message
  ): Promise<void> {
    const { orderId } = data;
    const order = await Order.findById(orderId).populate("item");
    if (!order) {
      throw new Error("Order not found");
    }
    order.set({
      status: OrderStatus.Cancelled,
    });
    await order.save();
    new OrderCancelledPublisher(this.client, true).publish({
      id: order.id,
      version: order.version,
      item: {
        id: order.item.id,
      },
    });
    message.ack();
  }
}
