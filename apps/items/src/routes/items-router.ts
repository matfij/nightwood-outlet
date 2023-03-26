import {
  NotFoundApiError,
  requireAuth,
  validateRequest,
} from "@nightwood/common";
import { NextFunction, Request, Response, Router } from "express";
import { body } from "express-validator";
import { Item } from "../models/item";

const itemsRouter = Router();

itemsRouter.post(
  "/api/items/create",
  requireAuth,
  [
    body("name").not().isEmpty().withMessage("Invalid name"),
    body("price").isFloat({ gt: 0, lt: 1000 }).withMessage("Invalid price"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { name, price } = req.body;
    const newItem = Item.build({
      name: name,
      price: price,
      userId: req.currentUser!.id,
    });
    await newItem.save();
    res.status(201).send(newItem);
  }
);

itemsRouter.get(
  "/api/items/readOne/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return next(new NotFoundApiError());
    }
    res.status(200).send(item);
  }
);

itemsRouter.get(
  "/api/items/readAll",
  async (req: Request, res: Response, next: NextFunction) => {
    const items = await Item.find();
    res.status(200).send(items);
  }
);

export { itemsRouter };
