import express, { json } from "express";
import mongoose from "mongoose";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundApiError } from "./models/not-found-api-error";
import authRouter from "./routes/auth-router";

const app = express();

app.use(json());
app.use(authRouter);
app.all("*", async (req, res, next) => {
  next(new NotFoundApiError());
});
app.use(errorHandler);

const connectDatabase = async () => {
  try {
    await mongoose.connect("mongodb://auth-db-srv:27017/auth");
    console.log("DB connected");
  } catch (err) {
    console.log(err);
  }
};

app.listen(3000, () => {
  connectDatabase();
  console.log("Server started on port 3000");
});
