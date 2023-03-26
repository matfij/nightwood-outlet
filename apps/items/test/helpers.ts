import { sign } from "jsonwebtoken";
import { Types } from "mongoose";
import { Item, ItemDocument } from "../src/models/item";

export const getCookies = (): string[] => {
  const token = sign(
    {
      id: "jf2j34fj02",
      email: "my@mail.net",
    },
    process.env.JWT_KEY!
  );
  const sessionString = JSON.stringify({ jwt: token });
  const sessionBase64 = Buffer.from(sessionString).toString("base64");
  return [`session=${sessionBase64}`];
};

export const getValidId = (): string => {
  return new Types.ObjectId().toHexString();
};

export async function createItem(): Promise<ItemDocument> {
  const newItem = Item.build({
    name: "Plate",
    price: 25,
    userId: getValidId(),
  });
  await newItem.save();
  return newItem;
}
