import mongoose from "mongoose";
import { app } from "./app";
import { natsContext } from "./events/nats-context";
import { OrderCreatedListener } from "./events/order-created-listener";
import { OrderCancelledListener } from "./events/order-cancelled-listener";

app.listen(3000, async () => {
  try {
    await natsContext.connect(
      process.env.NATS_CLUSTER_ID!,
      process.env.NATS_CLIENT_ID!,
      process.env.NATS_URL!,
    );
    natsContext.client.on("close", () => {
      console.log("NATS disconnected");
      process.exit();
    });
  } catch (err) {
    console.log(err);
  }
  new OrderCreatedListener(natsContext.client).listen();
  new OrderCancelledListener(natsContext.client).listen();
  try {
    await mongoose.connect(process.env.MONGO_URL!);
    console.log("DB connected");
  } catch (err) {
    console.log(err);
  }
  console.log("Server started on port 3000.");
});
