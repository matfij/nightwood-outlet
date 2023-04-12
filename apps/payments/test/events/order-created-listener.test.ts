import { OrderCreatedEvent, OrderStatus } from "@nightwood/common";
import { OrderCreatedListener } from "../../src/events/order-created-listener";
import { natsContext } from "../mocks/nats-context";
import { getValidId } from "../helpers";
import { Message } from "node-nats-streaming";
import { Order } from "../../src/models/order";

it("saves new order on order created event", async () => {
  // @ts-ignore
  const listener = new OrderCreatedListener(natsContext.client);
  const eventData: OrderCreatedEvent["data"] = {
    id: getValidId(),
    status: OrderStatus.Created,
    expiresAt: new Date().toISOString(),
    item: {
      id: getValidId(),
      price: 100,
    },
    userId: getValidId(),
    version: 0,
  };
  // @ts-ignore
  const eventMessage: Message = {
    ack: jest.fn(),
  };

  await listener.onMessage(eventData, eventMessage);

  const savedOrder = await Order.findById(eventData.id);

  expect(savedOrder).toBeDefined();
  expect(savedOrder?.price).toEqual(eventData.item.price);
  expect(eventMessage.ack).toHaveBeenCalled();
});
