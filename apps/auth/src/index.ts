import express, { json } from "express";
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

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
