import {
  BadRequestApiError,
  NotFoundApiError,
  OrderStatus,
} from "@nightwood/common";
import { ItemDoc } from "../mongo/items.interface";
import { Order } from "../mongo/orders.schema";
import { ORDER_EXIPRATION_TIME_SECONDS } from "../config/config";
import { Item } from "../mongo/items.schema";

export class OrdersService {

  public static async createOrder(itemId: string, userId: string) {
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
    return newOrder;
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
