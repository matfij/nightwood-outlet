import mongoose from "mongoose";
import { ItemAttrs, ItemDoc, ItemModel } from "./items.interface";

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

itemSchema.statics.build = (attrs: ItemAttrs) => {
  return new Item({
    ...attrs,
    _id: attrs.id,
  });
};

export const Item = mongoose.model<ItemDoc, ItemModel>("Item", itemSchema);
