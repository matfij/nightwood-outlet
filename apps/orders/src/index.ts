import mongoose from "mongoose";
import { app } from "./app";
import { natsContext } from "./events/nats-context";

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
  try {
    await mongoose.connect(process.env.MONGO_URL!);
    console.log("DB connected");
  } catch (err) {
    console.log(err);
  }
  console.log("Server started on port 3000.");
});
