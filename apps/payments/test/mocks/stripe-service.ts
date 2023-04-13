import { getValidId } from "../helpers";

export const StripeService = {
  charges: {
    create: jest.fn().mockResolvedValue({ id: getValidId() }),
  },
};
