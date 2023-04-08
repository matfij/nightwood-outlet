import {
  BadRequestApiError,
  Listener,
  OrderCancelledEvent,
  Subjects,
} from "@nightwood/common";
import { Message } from "node-nats-streaming";
import { LISTENER_GROUP_NAME } from "../config/config";
import { Item } from "../models/item";
import { ItemUpdatedPublisher } from "./item-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = LISTENER_GROUP_NAME;

  async onMessage(
    data: OrderCancelledEvent["data"],
    message: Message
  ): Promise<void> {
    const { item } = data;
    const reservedItem = await Item.findById(item.id);
    if (!reservedItem) {
      throw new BadRequestApiError("Item not found");
    }
    reservedItem.set({ orderId: undefined });
    await reservedItem.save();
    await new ItemUpdatedPublisher(this.client).publish({
      id: reservedItem.id,
      name: reservedItem.name,
      price: reservedItem.price,
      userId: reservedItem.userId,
      orderId: reservedItem.orderId,
      version: reservedItem.version,
    });
    message.ack();
  }
}
