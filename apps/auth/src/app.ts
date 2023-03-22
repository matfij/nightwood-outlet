import cookieSession from "cookie-session";
import express from "express";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundApiError } from "./models/not-found-api-error";
import authRouter from "./routes/auth-router";

const app = express();

app.set("trust proxy", true);
app.use(express.json());
app.use(cookieSession({ signed: false, secure: true }));
app.use(authRouter);
app.all("*", async (req, res, next) => {
  next(new NotFoundApiError());
});
app.use(errorHandler);

export { app };
