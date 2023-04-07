import { Document, model, Model, Schema } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface ItemAttrs {
  name: string;
  price: number;
  userId: string;
}

interface ItemDocument extends Document {
  name: string;
  price: number;
  userId: string;
  orderId?: string;
  version: number;
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
    orderId: {
      type: String,
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
  return new Item(attrs);
};

const Item = model<ItemDocument, ItemModel>("Item", itemSchema);

export { Item, ItemDocument };
