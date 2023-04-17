import { currentUser, errorHandler, NotFoundApiError } from "@nightwood/common";
import cookieSession from "cookie-session";
import express from "express";
import { itemsRouter } from "./routes/items-router";

const app = express();

app.set("trust proxy", true);
app.use(express.json());
app.use(
  cookieSession({ signed: false, secure: false })
);
app.use(currentUser);
app.use(itemsRouter);
app.all("*", async (req, res, next) => {
  next(new NotFoundApiError());
});
app.use(errorHandler);

export { app };
