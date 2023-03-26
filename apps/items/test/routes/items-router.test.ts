import request from "supertest";
import { app } from "../../src/app";
import { Item } from "../../src/models/item";
import { getCookies } from "../helpers";

it("create item fail due to not being authrized", async () => {
  const res = await request(app).post("/api/items/create").send({});
  expect(res.status).toEqual(401);
});

it("create item fail due to invalid name", async () => {
  const res = await request(app)
    .post("/api/items/create")
    .set("Cookie", getCookies())
    .send({
      name: "",
      price: 100,
    });
  expect(res.status).toEqual(400);
});

it("create item success", async () => {
  let items = await Item.find();
  expect(items.length).toEqual(0);
  const res = await request(app)
    .post("/api/items/create")
    .set("Cookie", getCookies())
    .send({
      name: "Old Map",
      price: 100,
      userId: "1",
    })
    .expect(201);
  items = await Item.find();
  expect(items.length).toEqual(1);
  expect(items[0].name).toEqual("Old Map");
  expect(items[0].price).toEqual(100);
});
