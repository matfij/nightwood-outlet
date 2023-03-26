import { requireAuth, validateRequest } from "@nightwood/common";
import { Request, Response, Router } from "express";
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

export { itemsRouter };
