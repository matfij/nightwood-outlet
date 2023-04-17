import { errorHandler, NotFoundApiError } from "@nightwood/common";
import cookieSession from "cookie-session";
import express from "express";
import authRouter from "./routes/auth-router";

const app = express();

app.set("trust proxy", true);
app.use(express.json());
app.use(
  cookieSession({ signed: false, secure: false })
);
app.use(authRouter);
app.all("*", async (req, res, next) => {
  next(new NotFoundApiError());
});
app.use(errorHandler);

export { app };
