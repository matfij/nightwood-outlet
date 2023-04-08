import {
  BadRequestApiError,
  NotFoundApiError,
  requireAuth,
  UnauthorizedApiError,
  validateRequest,
} from "@nightwood/common";
import { NextFunction, Request, Response, Router } from "express";
import { body } from "express-validator";
import { ItemCreatedPublisher } from "../events/item-created-publisher";
import { ItemUpdatedPublisher } from "../events/item-updated-publisher";
import { natsContext } from "../events/nats-context";
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
    await new ItemCreatedPublisher(natsContext.client, true).publish({
      id: newItem.id,
      name: newItem.name,
      price: newItem.price,
      userId: newItem.userId,
      version: newItem.version,
    });
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

itemsRouter.get("/api/items/readAll", async (req: Request, res: Response) => {
  const items = await Item.find();
  res.status(200).send(items);
});

itemsRouter.put(
  "/api/items/update/:id",
  requireAuth,
  [
    body("name").notEmpty().withMessage("Invalid name"),
    body("price").isFloat({ gt: 0, lt: 1000 }).withMessage("Invalid price"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return next(new NotFoundApiError());
    }
    if (item.userId !== req.currentUser!.id) {
      return next(new UnauthorizedApiError());
    }
    if (item.orderId) {
      return next(new BadRequestApiError("Item reserved"));
    }
    const { name, price } = req.body;
    item.set({
      name: name,
      price: price,
    });
    await item.save();
    await new ItemUpdatedPublisher(natsContext.client, true).publish({
      id: item.id,
      name: item.name,
      price: item.price,
      userId: item.userId,
      version: item.version,
    });
    res.status(200).send(item);
  }
);

export { itemsRouter };
