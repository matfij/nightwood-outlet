import mongoose from "mongoose";
import { app } from "./app";
import { natsContext } from "./events/nats-context";
import { ItemCreatedListener } from "./events/item-created.listener";
import { ItemUpdatedListener } from "./events/item-updated.listener";
import { ExpirationCompleteListener } from "./events/expiration-complete.listener";
import { PaymentCreatedListener } from "./events/payment-created.listener";

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
  } catch (error) {
    console.log(error);
  }

  new ItemCreatedListener(natsContext.client, true).listen();
  new ItemUpdatedListener(natsContext.client, true).listen();
  new ExpirationCompleteListener(natsContext.client, true).listen();
  new PaymentCreatedListener(natsContext.client, true).listen();

  try {
    await mongoose.connect(process.env.MONGO_URL!);
    console.log("DB connected");
  } catch (err) {
    console.log(err);
  }
  console.log("Server started on port 3000.");
});
