import express, { json } from "express";

const app = express();
app.use(json());

app.get("/api/users/currentUser", (req, res) => {
  res.send("hello");
});

app.listen(3000, () => {
  console.log("Server started on port 3000.");
});
