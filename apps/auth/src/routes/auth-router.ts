import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { validationResult } from "express-validator/src/validation-result";

const authRouter = Router();

authRouter.post(
  "/api/users/signUp",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Invalid password"),
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors.array());
    }
    const { email, password } = req.body;

    res.send(`<h2>Hello there, ${email} ${password}</h2>`);
  }
);

authRouter.post("/api/users/signIn", (req, res) => {
  res.send("<h2>Hello there, sign in</h2>");
});

authRouter.post("/api/users/signOut", (req, res) => {
  res.send("<h2>Hello there, sign out</h2>");
});

authRouter.get("/api/users/currentUser", (req, res) => {
  res.send("<h2>Hello there, current user</h2>");
});

export default authRouter;
