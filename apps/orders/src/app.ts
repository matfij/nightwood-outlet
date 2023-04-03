import { currentUser, errorHandler, NotFoundApiError, requireAuth } from "@nightwood/common";
import cookieSession from "cookie-session";
import express from "express";
import { OrdersRouter } from "./routers/orders.router";

const app: express.Application = express();

app.set("trust proxy", true);
app.use(express.json());
app.use(
  cookieSession({ signed: false, secure: process.env.NODE_ENV !== "test" })
);
app.use(currentUser);
app.use("/api", new OrdersRouter().router);
app.all("*", async (req, res, next) => {
  next(new NotFoundApiError());
});
app.use(errorHandler);

export { app };
