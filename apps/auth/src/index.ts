import mongoose from "mongoose";
import { app } from "./app";

app.listen(3000, async () => {
  try {
    await mongoose.connect("mongodb://auth-db-srv:27017/auth");
    console.log("DB connected");
  } catch (err) {
    console.log(err);
  }
  console.log("Server started on port 3000");
});
