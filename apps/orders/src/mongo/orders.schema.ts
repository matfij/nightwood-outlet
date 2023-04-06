import mongoose from "mongoose";
import { OrderAttrs, OrderDoc, OrderModel } from "./orders.interface";
import { OrderStatus } from "@nightwood/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
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

orderSchema.set("versionKey", "version");

orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

export const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);
