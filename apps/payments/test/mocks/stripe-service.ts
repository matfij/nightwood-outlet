import { getValidId } from "../helpers";

export const StripeService = {
  paymentIntents: {
    create: jest.fn().mockResolvedValue({ id: getValidId() }),
  },
};
