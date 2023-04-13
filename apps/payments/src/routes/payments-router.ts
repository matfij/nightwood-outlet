import {
  BadRequestApiError,
  NotFoundApiError,
  OrderStatus,
  UnauthorizedApiError,
  requireAuth,
  validateRequest,
} from "@nightwood/common";
import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { Order } from "../models/order";
import { StripeService } from "../services/stripe-service";
import { Payment } from "../models/payment";
import { PaymentCreatedPublisher } from "../events/payment-created-publisher";
import { natsContext } from "../events/nats-context";

const paymentsRouter = express.Router();

paymentsRouter.post(
  "/api/payments",
  requireAuth,
  [
    body("token").not().isEmpty().withMessage("Invalid token"),
    body("orderId").not().isEmpty().withMessage("Invalid orderId"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { token, orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      return next(new NotFoundApiError());
    }
    if (order.userId !== req.currentUser?.id) {
      return next(new UnauthorizedApiError());
    }
    if (order.status === OrderStatus.Cancelled) {
      return next(new BadRequestApiError("Order cancelled"));
    }
    const charge = await StripeService.charges.create({
      currency: "eur",
      amount: 100 * order.price,
      source: token,
    });
    const payment = Payment.build({
      orderId: orderId,
      chargeId: charge.id,
    });
    await payment.save();
    await new PaymentCreatedPublisher(natsContext.client, true).publish({
      id: payment.id,
      orderId: payment.orderId,
      chargeId: payment.chargeId,
      version: payment.version,
    });
    res.status(201).send({ payment: payment });
  }
);

export { paymentsRouter };
