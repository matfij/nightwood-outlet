import mongoose from "mongoose";
import { ItemAttrs, ItemDoc, ItemModel } from "./items.interface";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

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

itemSchema.set("versionKey", "version");

itemSchema.plugin(updateIfCurrentPlugin);

itemSchema.statics.build = (attrs: ItemAttrs) => {
  return new Item({
    ...attrs,
    _id: attrs.id,
  });
};

itemSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Item.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

export const Item = mongoose.model<ItemDoc, ItemModel>("Item", itemSchema);
