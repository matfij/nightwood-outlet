import mongoose from "mongoose";
import { app } from "./app";
import { natsContext } from "./events/nats-context";

app.listen(3000, async () => {
  try {
    await natsContext.connect(
      "nightwood-outlet",
      "items-service",
      "http://nats-srv:4222"
    );
    natsContext.client.on("close", () => {
      console.log("NATS disconnected");
      process.exit();
    });
  } catch (err) {
    console.log(err);
  }
  try {
    await mongoose.connect("mongodb://items-db-srv:27017/items");
    console.log("DB connected");
  } catch (err) {
    console.log(err);
  }
  console.log("Server started on port 3000.");
});
