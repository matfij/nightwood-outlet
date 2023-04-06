import { ItemUpdatedEvent, Listener, Subjects } from "@nightwood/common";
import { Message } from "node-nats-streaming";
import { LISTENER_GROUP_NAME } from "../config/config";
import { Item } from "../mongo/items.schema";

export class ItemUpdatedListener extends Listener<ItemUpdatedEvent> {
  readonly subject = Subjects.ItemUpdated;
  queueGroupName = LISTENER_GROUP_NAME;

  async onMessage(
    data: ItemUpdatedEvent["data"],
    message: Message
  ): Promise<void> {
    const { id, name, price } = data;
    const item = await Item.findById(id);
    if (!item) {
      return; // TODO - handle new item
    }
    item.set({ name, price });
    await item.save();
    message.ack();
  }
}
