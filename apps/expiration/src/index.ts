import { natsContext } from "./events/nats-context";
import { OrderCreatedListener } from "./events/order-created-listener";

async function start() {
  try {
    await natsContext.connect(
      process.env.NATS_CLUSTER_ID!,
      process.env.NATS_CLIENT_ID!,
      process.env.NATS_URL!
    );
    natsContext.client.on("close", () => {
      console.log("NATS disconnected");
      process.exit();
    });
  } catch (err) {
    console.log(err);
  }
  new OrderCreatedListener(natsContext.client, true).listen();
}

start();
