import { ExpirationCompleteEvent, OrderStatus } from "@nightwood/common";
import { ExpirationCompleteListener } from "../../src/events/expiration-complete.listener";
import { createItem, createOrder } from "../helpers";
import { natsContext } from "../mocks/nats-context";
import { Message } from "node-nats-streaming";
import { Order } from "../../src/mongo/orders.schema";

it("cancells order on expiration complete event", async () => {
  // @ts-ignore
  const listener = new ExpirationCompleteListener(natsContext.client);
  const item = await createItem();
  const order = await createOrder(item);
  const eventData: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };
  // @ts-ignore
  const eventMessage: Message = {
    ack: jest.fn(),
  };

  await listener.onMessage(eventData, eventMessage);

  const cancelledOrder = await Order.findById(order.id);
  expect(cancelledOrder?.status).toEqual(OrderStatus.Cancelled);

  const emittedData = JSON.parse(natsContext.client.publish.mock.calls[0][1]);
  expect(natsContext.client.publish).toHaveBeenCalled();
  expect(emittedData.id).toEqual(order.id);
});
