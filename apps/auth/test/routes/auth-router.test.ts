import request from "supertest";
import { app } from "../../src/app";

it("Sign up successfully", async () => {
  return request(app)
    .post("/api/users/signUp")
    .send({
      email: "my@mail.net",
      password: "test1234",
    })
    .expect(201);
});
