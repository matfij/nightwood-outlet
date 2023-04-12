import { sign } from "jsonwebtoken";
import { Types } from "mongoose";
import { OrderStatus } from "@nightwood/common";
import { Order, OrderDoc } from "../src/models/order";

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

export async function createOrder(userId?: string): Promise<OrderDoc> {
  const newOrder = Order.build({
    price: 100,
    status: OrderStatus.Created,
    userId: userId ?? getValidId(),
    version: 1,
  });
  await newOrder.save();
  return newOrder;
}
