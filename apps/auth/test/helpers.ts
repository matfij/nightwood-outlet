import request from "supertest";
import { app } from "../src/app";

export async function getCookie(): Promise<string[]> {
  const email = "my@mail.net";
  const password = "test1234";
  const res = await request(app)
    .post("/api/users/signUp")
    .send({ email, password })
    .expect(201);
  const cookie = res.get("Set-Cookie");
  return cookie;
}
