import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

export interface PaymentAttrs {
  orderId: string;
  chargeId: string;
}

export interface PaymentDoc extends mongoose.Document {
  orderId: string;
  chargeId: string;
  version: number;
}

export interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc;
}

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    chargeId: {
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

paymentSchema.set("versionKey", "version");

paymentSchema.plugin(updateIfCurrentPlugin);

paymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment(attrs);
};

export const Payment = mongoose.model<PaymentDoc, PaymentModel>(
  "Payment",
  paymentSchema
);
