import mongoose from "mongoose";

export interface ItemAttrs {
  name: string;
  price: number;
}

export interface ItemDoc extends mongoose.Document {
  name: string;
  price: number;
}

export interface ItemModel extends mongoose.Model<ItemDoc> {
  build(attrs: ItemAttrs): ItemDoc;
}
