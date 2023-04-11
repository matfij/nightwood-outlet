import { OrderStatus } from "@nightwood/common";
import mongoose from "mongoose";
import { ItemDoc } from "./items.interface";

/**
 * @openapi
 * components:
 *  schemas:
 *   Order:
 *    type: object
 *    required:
 *     - userId
 *     - status
 *     - expiresAt
 *     - item
 *    properties:
 *     userId:
 *      type: string
 *      default: jf930v5239kd
 *     status:
 *      type: string
 *      enum:
 *       - Created
 *       - Cancelled
 *       - Completed
 *     expiresAt:
 *      type: string
 *      default: 22.10.2024
 *     item:
 *      type: object
 *      $ref: '#/components/schemas/Item'
 */
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
