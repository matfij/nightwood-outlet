import { OrderStatus } from "@nightwood/common";
import mongoose from "mongoose";
import { ItemDoc } from "./items.interface";

export interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  item: ItemDoc;
}

export interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  item: ItemDoc;
  version: number;
}

export interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}
