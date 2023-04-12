import Queue from "bull";
import { EXPIRATION_QUEUE_NAME } from "../config/config";
import { ExpirationCompletePublisher } from "../events/expiration-complete-publisher";
import { natsContext } from "../events/nats-context";

export interface QueuePayload {
  orderId: string;
}

export const expirationQueue = new Queue<QueuePayload>(EXPIRATION_QUEUE_NAME, {
  redis: {
    host: process.env.REDIS_URL,
  },
});

expirationQueue.process(async (job) => {
  console.log('cancel')
  new ExpirationCompletePublisher(natsContext.client).publish({
    orderId: job.data.orderId,
  });
});
