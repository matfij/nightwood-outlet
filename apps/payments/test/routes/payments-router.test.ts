import supertest from "supertest";
import { app } from "../../src/app";
import { createOrder, getCookies, getValidId } from "../helpers";
import { OrderStatus } from "@nightwood/common";
import { StripeService } from "../mocks/stripe-service";
import { Payment } from "../../src/models/payment";

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

  const res = await supertest(app)
    .post("/api/payments")
    .set("Cookie", getCookies(userId))
    .send({
      token: "tok_visa",
      orderId: order.id,
    })
    .expect(201);

  const chargeParams = StripeService.paymentIntents.create.mock.calls[0][0];
  expect(StripeService.paymentIntents.create).toHaveBeenCalled();
  expect(chargeParams.amount).toEqual(100 * order.price);
  expect(chargeParams.currency).toEqual("eur");

  const payment = await Payment.findOne({
    orderId: res.body.payment.orderId,
    chargeId: res.body.payment.chargeId,
    version: 0,
  });
  expect(payment?.orderId).toEqual(order.id);
});
