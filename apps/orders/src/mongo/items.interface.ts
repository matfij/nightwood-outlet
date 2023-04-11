import mongoose from "mongoose";

/**
 * @openapi
 * components:
 *  schemas:
 *   Item:
 *    type: object
 *    required:
 *     - name
 *     - price
 *    properties:
 *     id:
 *      type: string
 *      default: 21324sdfsfadf
 *     name:
 *      type: string
 *      default: Plate
 *     price:
 *      type: number
 *      default: 120
 */
export interface ItemAttrs {
  id: string;
  name: string;
  price: number;
}

export interface ItemDoc extends mongoose.Document {
  name: string;
  price: number;
  version: number;
}

export interface ItemModel extends mongoose.Model<ItemDoc> {
  build(attrs: ItemAttrs): ItemDoc;
  findByEvent(event: { id: string; version: number }): Promise<ItemDoc | null>;
}
