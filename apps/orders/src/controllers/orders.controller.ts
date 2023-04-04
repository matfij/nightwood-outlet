import { NextFunction, Request, Response } from "express";
import { OrdersService } from "../services/orders.service";

export class OrdersController {
  public getOrders = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.currentUser!.id;
      const orders = await OrdersService.finalAllOrders(userId);
      res.status(200).send(orders);
    } catch (error) {
      next(error);
    }
  };

  public getOrderById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const orderId = req.params.id;
      const userId = req.currentUser!.id;
      const order = await OrdersService.findOrderById(orderId, userId);
      res.status(200).send(order);
    } catch (error) {
      next(error);
    }
  };

  public createOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { itemId } = req.body;
      const userId = req.currentUser!.id;
      const newOrder = await OrdersService.createOrder(itemId, userId);
      res.status(201).send(newOrder);
    } catch (error) {
      return next(error);
    }
  };

  public deleteOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const orderId = req.params.id;
      const userId = req.currentUser!.id;
      const order = await OrdersService.deleteOrder(orderId, userId);
      res.status(200).send(order);
    } catch (error) {
      next(error);
    }
  };
}
