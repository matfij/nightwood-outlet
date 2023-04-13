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
    await StripeService.charges.create({
      currency: "eur",
      amount: 100 * order.price,
      source: token,
    });
    res.send({ success: true });
  }
);

export { paymentsRouter };
