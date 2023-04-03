import { currentUser, requireAuth } from "@nightwood/common";
import { Router } from "express";
import { OrdersController } from "../controllers/orders.controller";
import { body } from "express-validator";

export interface Routes {
  path?: string;
  router: Router;
}

export class OrdersRouter implements Routes {
  public path = "/orders";
  public router = Router();
  public ordersController = new OrdersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}`,
      requireAuth,
      this.ordersController.getOrders
    );
    this.router.get(
      `${this.path}/:id`,
      requireAuth,
      this.ordersController.getOrderById
    );
    this.router.post(
      `${this.path}`,
      requireAuth,
      [body("ticketId").notEmpty().withMessage("Invalid ticketId.")],
      this.ordersController.createOrder
    );
    this.router.delete(
      `${this.path}/:id`,
      requireAuth,
      this.ordersController.deleteOrder
    );
  }
}
