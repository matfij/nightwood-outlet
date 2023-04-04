import request from "supertest";
import { createItem, createOrder, getCookies, getValidId } from "../helpers";
import { app } from "../../src/app";

it("fails to create order - requested item does not exist", async () => {
  await request(app)
    .post("/api/orders")
    .set("Cookie", getCookies())
    .send({ itemId: getValidId() })
    .expect(404);
});

it("fails to create order - requested item is reserved", async () => {
  const item = await createItem();
  const order = await createOrder(item);

  await request(app)
    .post("/api/orders")
    .set("Cookie", getCookies())
    .send({ itemId: item.id })
    .expect(400);
});

it("successfully creates order", async () => {
  const item = await createItem();

  await request(app)
    .post("/api/orders")
    .set("Cookie", getCookies())
    .send({ itemId: item.id })
    .expect(201);
});
