import request from "supertest";
import { app } from "../../src/app";
import { getCookie } from "../helpers";

it("Sign up successfully", async () => {
  await request(app)
    .post("/api/users/signUp")
    .send({
      email: "my@mail.net",
      password: "test1234",
    })
    .expect(201);
});

it("Sign up fail - incorrect email", async () => {
  await request(app)
    .post("/api/users/signUp")
    .send({
      email: "mymail-net",
      password: "test1234",
    })
    .expect(400);
});

it("Sign up fail - incorrect password", async () => {
  await request(app)
    .post("/api/users/signUp")
    .send({
      email: "my@mail.net",
      password: " ",
    })
    .expect(400);
});

it("Sign up fail - duplicated email", async () => {
  await request(app)
    .post("/api/users/signUp")
    .send({
      email: "my@mail.net",
      password: "test1234",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signUp")
    .send({
      email: "my@mail.net",
      password: "test1234",
    })
    .expect(400);
});

it("Sign up success - cookie set correctly", async () => {
  const res = await request(app)
    .post("/api/users/signUp")
    .send({
      email: "my@mail.net",
      password: "test1234",
    })
    .expect(201);

  expect(res.get("Set-Cookie")).toBeDefined();
});

it("Sign in fail - user does not exist", async () => {
  await request(app)
    .post("/api/users/signIn")
    .send({
      email: "my@mail.com",
      password: "test1234",
    })
    .expect(400);
});

it("Sign in fail - user provided incorrect credentials", async () => {
  await request(app)
    .post("/api/users/signUp")
    .send({
      email: "my@mail.net",
      password: "test1234",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signIn")
    .send({
      email: "my@mail.net",
      password: "badpass9876",
    })
    .expect(400);
});

it("Sign in success", async () => {
  await request(app)
    .post("/api/users/signUp")
    .send({
      email: "my@mail.net",
      password: "test1234",
    })
    .expect(201);

  const res = await request(app)
    .post("/api/users/signIn")
    .send({
      email: "my@mail.net",
      password: "test1234",
    })
    .expect(200);

  expect(res.get("Set-Cookie")).toBeDefined();
});

it("Sign out success", async () => {
  const cookie = await getCookie();

  expect(cookie).toBeDefined();

  await request(app)
    .post("/api/users/signOut")
    .send({
      email: "my@mail.net",
      password: "test1234",
    })
    .expect(200);
});

it("Get current user details", async () => {
  const cookie = await getCookie();

  const res = await request(app)
    .get("/api/users/currentUser")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(res.body.currentUser.email).toEqual("my@mail.net");
});
