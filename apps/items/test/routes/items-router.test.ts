import request from "supertest";
import { app } from "../../src/app";
import { Item } from "../../src/models/item";
import { createItem, getCookies, getValidId } from "../helpers";

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
    })
    .expect(201);
  items = await Item.find();
  expect(items.length).toEqual(1);
  expect(items[0].name).toEqual("Old Map");
  expect(items[0].price).toEqual(100);
});

it("read item fail - not found", async () => {
  await request(app)
    .get(`/api/items/readOne/${getValidId()}`)
    .send()
    .expect(404);
});

it("read item success", async () => {
  const newItem = await createItem();
  const res = await request(app)
    .get(`/api/items/readOne/${newItem.id}`)
    .send()
    .expect(200);
  expect(res.body.name).toEqual("Plate");
  expect(res.body.price).toEqual(25);
});

it("read all items success", async () => {
  await createItem();
  await createItem();
  await createItem();
  const res = await request(app).get("/api/items/readAll").send().expect(200);
  expect(res.body.length).toEqual(3);
});

it("update item fail - item not found", async () => {
  await request(app)
    .put(`/api/items/update/${getValidId()}`)
    .set("Cookie", getCookies())
    .send({
      name: "New Map",
      price: 10,
    })
    .expect(404);
});

it("update item fail - trying to update not owned item", async () => {
  const item = await createItem();
  await request(app)
    .put(`/api/items/update/${item.id}`)
    .set("Cookie", getCookies())
    .send({
      name: "New Map",
      price: 10,
    })
    .expect(401);
});

it("update item fail - invalid name", async () => {
  const res = await request(app)
    .post(`/api/items/create`)
    .set("Cookie", getCookies())
    .send({
      name: "Old Map",
      price: 100,
    })
    .expect(201);
  await request(app)
    .put(`/api/items/update/${res.body.id}`)
    .set("Cookie", getCookies())
    .send({
      name: "",
      price: 10,
    })
    .expect(400);
});

it("update item success", async () => {
  let res = await request(app)
    .post(`/api/items/create`)
    .set("Cookie", getCookies())
    .send({
      name: "Old Map",
      price: 100,
    })
    .expect(201);
  const oldItem = res.body;
  res = await request(app)
    .put(`/api/items/update/${oldItem.id}`)
    .set("Cookie", getCookies())
    .send({
      name: "New Map",
      price: 100,
    })
    .expect(200);
  const newItem = res.body;
  expect(newItem.name).toEqual("New Map");
});
