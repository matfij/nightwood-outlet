import express, { json } from "express";
import authRouter from "./routes/auth-router";

const app = express();
app.use(json());

app.use(authRouter);

app.listen(3000, () => {
  console.log("Server started on port 3000.");
});
