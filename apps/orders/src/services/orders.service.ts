import {
  BadRequestApiError,
  NotFoundApiError,
  OrderStatus,
} from "@nightwood/common";
import { ItemDoc } from "../mongo/items.interface";
import { Order } from "../mongo/orders.schema";
import { ORDER_EXIPRATION_TIME_SECONDS } from "../config/config";
import { Item } from "../mongo/items.schema";
import { OrderDoc } from "../mongo/orders.interface";
import { OrderCreatedPublisher } from "../events/order-created.publisher";
import { natsContext } from "../events/nats-context";
import { OrderCancelledPublisher } from "../events/order-cancelled.publisher";

export class OrdersService {
  public static async finalAllOrders(userId: string): Promise<OrderDoc[]> {
    const orders = await Order.find({ userId: userId }).populate("item");
    return orders;
  }

  public static async findOrderById(
    orderId: string,
    userId: string
  ): Promise<OrderDoc> {
    const order = await Order.findById(orderId).populate("item");
    if (!order) {
      throw new NotFoundApiError();
    }
    if (order.userId !== userId) {
      throw new BadRequestApiError("Order not owned");
    }
    return order;
  }

  public static async createOrder(
    itemId: string,
    userId: string
  ): Promise<OrderDoc> {
    const requestedItem = await Item.findById(itemId);
    if (!requestedItem) {
      throw new NotFoundApiError();
    }
    const itemReserved = await this.checkItemReserved(requestedItem);
    if (itemReserved) {
      throw new BadRequestApiError("Item reserved");
    }
    const expiration = new Date();
    expiration.setSeconds(
      expiration.getSeconds() + ORDER_EXIPRATION_TIME_SECONDS
    );
    const newOrder = Order.build({
      userId: userId,
      item: requestedItem,
      expiresAt: expiration,
      status: OrderStatus.Created,
    });
    await newOrder.save();
    new OrderCreatedPublisher(natsContext.client).publish({
      id: newOrder.id,
      status: newOrder.status,
      userId: newOrder.userId,
      expiresAt: newOrder.expiresAt.toISOString(),
      item: {
        id: newOrder.item.id,
        price: newOrder.item.price,
      },
    });
    return newOrder;
  }

  public static async deleteOrder(
    orderId: string,
    userId: string
  ): Promise<OrderDoc> {
    const cancelledOrder = await Order.findById(orderId).populate('item');
    if (!cancelledOrder) {
      throw new NotFoundApiError();
    }
    if (cancelledOrder.userId !== userId) {
      throw new BadRequestApiError("Order not owned");
    }
    cancelledOrder.status = OrderStatus.Cancelled;
    await cancelledOrder.save();
    new OrderCancelledPublisher(natsContext.client).publish({
      id: cancelledOrder.id,
      item: {
        id: cancelledOrder.item.id,
      },
    });
    return cancelledOrder;
  }

  public static async checkItemReserved(item: ItemDoc): Promise<boolean> {
    const existingOrder = await Order.findOne({
      item: item,
      status: {
        $in: [
          OrderStatus.Created,
          OrderStatus.AwaitingPayment,
          OrderStatus.Complete,
        ],
      },
    });
    return !!existingOrder;
  }
}
