import { NextFunction, Request, Response } from "express";

export class OrdersController {
  public ordersService = {} as any; // new OrdersService();

  public getOrders = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
    //   const orders = this.ordersService.findAllOrders();
      res.status(200).send({ data: "getOrders" });
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
    //   const order = this.ordersService.findOrderById();
      res.status(200).send({ data: "getOrderById" });
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
    //   const orders = this.ordersService.createOrder();
      res.status(200).send({ data: "createOrder" });
    } catch (error) {
      next(error);
    }
  };

  public deleteOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
    //   const orders = this.ordersService.deleteOrder();
      res.status(200).send({ data: "deleteOrder" });
    } catch (error) {
      next(error);
    }
  };
}
