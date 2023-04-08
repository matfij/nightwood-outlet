import { OrderCreatedEvent, OrderStatus } from "@nightwood/common";
import { OrderCreatedListener } from "../../src/events/order.created-listener";
import { createItem, getValidId } from "../helpers";
import { natsContext } from "../mocks/nats-context";
import { Message } from "node-nats-streaming";
import { Item } from "../../src/models/item";

it("Links order with an exiting item", async () => {
  // @ts-ignore
  const listener = new OrderCreatedListener(natsContext.client);
  const item = await createItem();
  const eventData: OrderCreatedEvent["data"] = {
    id: getValidId(),
    status: OrderStatus.Created,
    expiresAt: new Date().toISOString(),
    item: {
      id: item.id,
      price: item.price,
    },
    userId: getValidId(),
    version: 0,
  };
  // @ts-ignore
  const eventMessage: Message = {
    ack: jest.fn(),
  };

  await listener.onMessage(eventData, eventMessage);
  const updatedItem = await Item.findById(item.id);

  expect(updatedItem).toBeDefined();
  expect(updatedItem?.orderId).toEqual(eventData.id);
  expect(eventMessage.ack).toHaveBeenCalled();
  expect(natsContext.client.publish).toHaveBeenCalled();

  const itemUpdatedData = JSON.parse(
    natsContext.client.publish.mock.calls[0][1]
  );
  expect(itemUpdatedData.orderId).toEqual(eventData.id);
});
