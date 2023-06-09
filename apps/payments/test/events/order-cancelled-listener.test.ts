import { OrderCancelledEvent, OrderStatus } from "@nightwood/common";
import { OrderCancelledListener } from "../../src/events/order-cancelled-listener";
import { createOrder, getValidId } from "../helpers";
import { natsContext } from "../mocks/nats-context";
import { Message } from "node-nats-streaming";
import { Order } from "../../src/models/order";

it("cancells order on order cancelled event", async () => {
  // @ts-ignore
  const listener = new OrderCancelledListener(natsContext.client);
  const order = await createOrder();
  const eventData: OrderCancelledEvent["data"] = {
    id: order.id,
    item: {
      id: getValidId(),
    },
    version: order.version + 1,
  };
  // @ts-ignore
  const eventMessage: Message = {
    ack: jest.fn(),
  };

  await listener.onMessage(eventData, eventMessage);

  const cancelledOrder = await Order.findById(order.id);
  expect(cancelledOrder?.status).toEqual(OrderStatus.Cancelled);
  expect(eventMessage.ack).toHaveBeenCalled();
});
