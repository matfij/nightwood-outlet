import {
  Listener,
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
} from "@nightwood/common";
import { Message } from "node-nats-streaming";
import { LISTENER_GROUP_NAME } from "../config/config";
import { Order } from "../models/order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  readonly queueGroupName = LISTENER_GROUP_NAME;

  async onMessage(
    data: OrderCancelledEvent["data"],
    message: Message
  ): Promise<void> {
    const { id, version } = data;
    const savedOrder = await Order.findOne({
      _id: id,
      version: version - 1,
    });
    if (!savedOrder) {
      throw new Error("Order not found");
    }
    savedOrder.set({
      status: OrderStatus.Cancelled,
    });
    await savedOrder.save();
    message.ack();
  }
}
