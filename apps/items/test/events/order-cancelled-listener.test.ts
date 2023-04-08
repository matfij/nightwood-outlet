import { OrderCancelledEvent } from "@nightwood/common";
import { OrderCancelledListener } from "../../src/events/order-cancelled-listener";
import { createItem, getValidId } from "../helpers";
import { natsContext } from "../mocks/nats-context";
import { Message } from "node-nats-streaming";
import { Item } from "../../src/models/item";

it("Unlinks cancelled order from item", async () => {
  // @ts-ignore
  const listener = new OrderCancelledListener(natsContext.client);
  const item = await createItem();

  const orderId = getValidId();
  item.set({ orderId: orderId });
  await item.save();

  const eventData: OrderCancelledEvent["data"] = {
    id: orderId,
    version: 0,
    item: {
      id: item.id,
    },
  };
  // @ts-ignore
  const eventMessage: Message = {
    ack: jest.fn(),
  };

  await listener.onMessage(eventData, eventMessage);

  const updatedItem = await Item.findById(item.id);
  expect(updatedItem?.orderId).not.toBeDefined();
  expect(eventMessage.ack).toHaveBeenCalled();
  expect(natsContext.client.publish).toHaveBeenCalled();
});
