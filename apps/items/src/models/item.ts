import { Document, model, Model, Schema } from "mongoose";

interface ItemAttrs {
  name: string;
  price: number;
  userId: string;
}

interface ItemDocument extends Document {
  name: string;
  price: number;
  userId: string;
}

interface ItemModel extends Model<ItemDocument> {
  build(attrs: ItemAttrs): ItemDocument;
}

const itemSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

itemSchema.statics.build = (attrs: ItemAttrs) => {
  return new Item(attrs);
};

const Item = model<ItemDocument, ItemModel>("Item", itemSchema);

export { Item, ItemDocument };
