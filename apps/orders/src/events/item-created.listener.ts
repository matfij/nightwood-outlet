import { ItemCreatedEvent, Listener, Subjects } from "@nightwood/common";
import { Message } from "node-nats-streaming";
import { LISTENER_GROUP_NAME } from "../config/config";
import { Item } from "../mongo/items.schema";

export class ItemCreatedListener extends Listener<ItemCreatedEvent> {
  readonly subject = Subjects.ItemCreated;
  readonly queueGroupName = LISTENER_GROUP_NAME;

  async onMessage(
    data: ItemCreatedEvent["data"],
    message: Message
  ): Promise<void> {
    const { id, name, price } = data;
    const newItem = Item.build({
      id: id,
      name: name,
      price: price,
    });
    await newItem.save();
    message.ack();
  }
}
