import supertest from "supertest";
import { app } from "../../src/app";
import { createOrder, getCookies, getValidId } from "../helpers";
import { OrderStatus } from "@nightwood/common";
import { StripeService } from "../mocks/stripe-service";

it("fails to create payment for not exiting order", async () => {
  await supertest(app)
    .post("/api/payments")
    .set("Cookie", getCookies())
    .send({
      token: "tok_visa",
      orderId: getValidId(),
    })
    .expect(404);
});

it("fails to create payment for not owned order", async () => {
  const order = await createOrder();

  await supertest(app)
    .post("/api/payments")
    .set("Cookie", getCookies())
    .send({
      token: "tok_visa",
      orderId: order.id,
    })
    .expect(401);
});

it("fails to create payment for cancelled order", async () => {
  const userId = getValidId();
  const order = await createOrder(userId);
  order.status = OrderStatus.Cancelled;
  await order.save();

  await supertest(app)
    .post("/api/payments")
    .set("Cookie", getCookies(userId))
    .send({
      token: "tok_visa",
      orderId: order.id,
    })
    .expect(400);
});

it("create charges for a valid order", async () => {
  const userId = getValidId();
  const order = await createOrder(userId);

  await supertest(app)
    .post("/api/payments")
    .set("Cookie", getCookies(userId))
    .send({
      token: "tok_visa",
      orderId: order.id,
    })
    .expect(200);

  const chargeOptions = StripeService.charges.create.mock.calls[0][0];
  expect(StripeService.charges.create).toHaveBeenCalled();
  expect(chargeOptions.source).toEqual("tok_visa");
  expect(chargeOptions.amount).toEqual(100 * order.price);
  expect(chargeOptions.currency).toEqual("eur");
});
