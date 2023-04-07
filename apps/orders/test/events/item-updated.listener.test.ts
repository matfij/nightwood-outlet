import { ItemUpdatedEvent } from "@nightwood/common";
import { ItemUpdatedListener } from "../../src/events/item-updated.listener";
import { createItem, getValidId } from "../helpers";
import { natsContext } from "../mocks/nats-context";
import { Item } from "../../src/mongo/items.schema";

it("saves updated item", async () => {
  // @ts-ignore
  const listener = new ItemUpdatedListener(natsContext.client);
  const item = await createItem();
  const eventData: ItemUpdatedEvent["data"] = {
    id: item.id,
    name: `${item.name} MK II`,
    price: item.price * 1.25,
    userId: getValidId(),
    version: item.version + 1,
  };
  // @ts-ignore
  const eventMessage: Message = {
    ack: jest.fn(),
  };

  await listener.onMessage(eventData, eventMessage);
  const updatedItem = await Item.findById(item.id);

  expect(updatedItem).toBeDefined();
  expect(updatedItem?.name).toEqual(eventData.name);
  expect(updatedItem?.price).toEqual(eventData.price);
  expect(eventMessage.ack).toHaveBeenCalled();
});

it("does not update in case of out of order event", async () => {
  // @ts-ignore
  const listener = new ItemUpdatedListener(natsContext.client);
  const item = await createItem();
  const eventData: ItemUpdatedEvent["data"] = {
    id: item.id,
    name: `${item.name} MK II`,
    price: item.price * 1.25,
    userId: getValidId(),
    version: item.version + 15,
  };
  // @ts-ignore
  const eventMessage: Message = {
    ack: jest.fn(),
  };

  await listener.onMessage(eventData, eventMessage);
  const updatedItem = await Item.findById(item.id);

  expect(updatedItem).toBeDefined();
  expect(updatedItem?.name).toEqual(item.name);
  expect(updatedItem?.price).toEqual(item.price);
  expect(eventMessage.ack).not.toHaveBeenCalled();
});
