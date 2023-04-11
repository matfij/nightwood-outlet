import Queue from "bull";
import { EXPIRATION_QUEUE_NAME } from "../config/config";

export interface QueuePayload {
  orderId: string;
}

export const expirationQueue = new Queue<QueuePayload>(EXPIRATION_QUEUE_NAME, {
  redis: {
    host: process.env.REDIS_URL,
  },
});

expirationQueue.process(async (job) => {
  console.log("Publishing expiration_complee event for", job.data.orderId);
});
