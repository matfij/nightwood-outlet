import { Message, Stan } from "node-nats-streaming";
import { ItemCreatedListener } from "../../src/events/item-created.listener";
import { natsContext } from "../mocks/nats-context";
import { ItemCreatedEvent } from "@nightwood/common";
import { getValidId } from "../helpers";
import { Item } from "../../src/mongo/items.schema";

it("saves a new item", async () => {
  // @ts-ignore
  const listener = new ItemCreatedListener(natsContext.client);
  const eventData: ItemCreatedEvent["data"] = {
    id: getValidId(),
    name: "Plate Armor",
    price: 125,
    userId: getValidId(),
    version: 0,
  };
  // @ts-ignore
  const eventMessage: Message = {
    ack: jest.fn(),
  };

  await listener.onMessage(eventData, eventMessage);
  const item = await Item.findById(eventData.id);

  expect(item).toBeDefined();
  expect(item?.name).toEqual(eventData.name);
  expect(item?.price).toEqual(eventData.price);
  expect(eventMessage.ack).toHaveBeenCalled();
});
