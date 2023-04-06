import { Item } from "../../src/models/item";
import { getValidId } from "../helpers";

it("fails to update stale item", async () => {
  const item = Item.build({
    name: "Treasure Chest",
    price: 500,
    userId: getValidId(),
  });
  await item.save();

  const firstItemInstance = await Item.findById(item.id);
  const secondItemInstance = await Item.findById(item.id);

  firstItemInstance!.set({ price: 400 });
  secondItemInstance!.set({ price: 600 });

  await firstItemInstance!.save();
  expect(secondItemInstance!.save()).rejects.toThrow();
});

it("increment item version after save", async () => {
  const item = Item.build({
    name: "Treasure Chest",
    price: 500,
    userId: getValidId(),
  });
  await item.save();
  expect(item.version).toEqual(0);
  await item.save();
  expect(item.version).toEqual(1);
});
