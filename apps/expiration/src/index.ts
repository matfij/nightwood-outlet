import { natsContext } from "./events/nats-context";

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
}

start();
