import mongoose from "mongoose";

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
