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

it("successfully reads user orders", async () => {
  const userId = getValidId();
  const itemA = await createItem();
  const itemB = await createItem();
  const itemC = await createItem();
  const orderA = await createOrder(itemA, userId);
  const orderB = await createOrder(itemB, userId);
  const orderC = await createOrder(itemC);

  const res = await request(app)
    .get("/api/orders")
    .set("Cookie", getCookies(userId))
    .expect(200);

  expect(res.body.length).toEqual(2);
  expect(res.body[0].id).toEqual(orderA.id);
  expect(res.body[1].id).toEqual(orderB.id);
});

it("fails to read not owned order", async () => {
  const userId = getValidId();
  const item = await createItem();
  const order = await createOrder(item);

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", getCookies(userId))
    .expect(400);
});

it("successfully reads owned order", async () => {
  const userId = getValidId();
  const item = await createItem();
  const order = await createOrder(item, userId);

  const res = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", getCookies(userId))
    .expect(200);

  expect(res.body.id).toEqual(order.id);
});
