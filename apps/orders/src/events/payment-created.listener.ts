import {
  Listener,
  OrderStatus,
  PaymentCreatedEvent,
  Subjects,
} from "@nightwood/common";
import { Message } from "node-nats-streaming";
import { Order } from "../mongo/orders.schema";
import { LISTENER_GROUP_NAME } from "../config/config";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  readonly queueGroupName = LISTENER_GROUP_NAME;

  async onMessage(
    data: PaymentCreatedEvent["data"],
    message: Message
  ): Promise<void> {
    const { orderId } = data;
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }
    order.set({
      status: OrderStatus.Complete,
    });
    await order.save();
    message.ack();
  }
}
