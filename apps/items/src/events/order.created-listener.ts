import {
  BadRequestApiError,
  Listener,
  OrderCreatedEvent,
  Subjects,
} from "@nightwood/common";
import { Message } from "node-nats-streaming";
import { LISTENER_GROUP_NAME } from "../config/config";
import { Item } from "../models/item";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = LISTENER_GROUP_NAME;

  async onMessage(
    data: OrderCreatedEvent["data"],
    message: Message
  ): Promise<void> {
    const { id, item } = data;
    const reservedItem = await Item.findById(item.id);
    if (!reservedItem) {
      throw new BadRequestApiError("Item not found");
    }
    reservedItem.set({ orderId: id });
    await reservedItem.save();
    message.ack();
  }
}
