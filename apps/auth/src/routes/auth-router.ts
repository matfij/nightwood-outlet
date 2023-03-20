import { NextFunction, Request, Response, Router } from "express";
import { body } from "express-validator";
import { validationResult } from "express-validator/src/validation-result";
import { BadRequestApiError } from "../models/bad-request-api-error";
import { DatabaseApiError } from "../models/database-api-error";
import { User } from "../models/user";
import { ValidationApiError } from "../models/validation-api-error";

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
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationApiError(errors.array()));
    }
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new BadRequestApiError("Email occuied"));
    }
    const newUser = User.build({
      email: email,
      password: password,
    });
    await newUser.save();
    res.status(201).send(newUser);
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
