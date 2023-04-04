import { sign } from "jsonwebtoken";
import { Types } from "mongoose";
import { Item } from "../src/mongo/items.schema";
import { ItemDoc } from "../src/mongo/items.interface";
import { OrderDoc } from "../src/mongo/orders.interface";
import { Order } from "../src/mongo/orders.schema";
import { OrderStatus } from "@nightwood/common";

export const getCookies = (userId?: string): string[] => {
  const token = sign(
    {
      id: userId ?? getValidId(),
      email: "my@mail.net",
    },
    process.env.JWT_KEY!
  );
  const sessionString = JSON.stringify({ jwt: token });
  const sessionBase64 = Buffer.from(sessionString).toString("base64");
  return [`session=${sessionBase64}`];
};

export const getValidId = (): string => {
  return new Types.ObjectId().toHexString();
};

export async function createItem(): Promise<ItemDoc> {
  const newItem = Item.build({
    name: "Plate",
    price: 25,
  });
  await newItem.save();
  return newItem;
}

export async function createOrder(item: ItemDoc, userId?: string): Promise<OrderDoc> {
  const newOrder = Order.build({
    expiresAt: new Date(),
    item: item,
    status: OrderStatus.Created,
    userId: userId ?? getValidId(),
  });
  await newOrder.save();
  return newOrder;
}
