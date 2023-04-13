import Stripe from "stripe";

export const StripeService = new Stripe(process.env.STRIPE_KEY || "", {
  apiVersion: "2022-11-15",
});
