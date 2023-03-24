import { errorHandler, NotFoundApiError } from "@nightwood/common";
import cookieSession from "cookie-session";
import express from "express";
import authRouter from "./routes/auth-router";

const app = express();

app.set("trust proxy", true);
app.use(express.json());
app.use(
  cookieSession({ signed: false, secure: process.env.NODE_ENV !== "test" })
);
app.use(authRouter);
app.all("*", async (req, res, next) => {
  next(new NotFoundApiError());
});
app.use(errorHandler);

export { app };
