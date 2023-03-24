import { BadRequestApiError, currentUser, requireAuth, validateRequest } from "@nightwood/common";
import { NextFunction, Request, Response, Router } from "express";
import { body } from "express-validator";
import { sign } from "jsonwebtoken";
import { User } from "../models/user";
import { PasswordService } from "../services/password-service";

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
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
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
    const userJwt = sign(
      {
        id: newUser.id,
        email: newUser.email,
      },
      process.env.JWT_KEY!
    );
    req.session = { jwt: userJwt };
    res.status(201).send(newUser);
  }
);

authRouter.post(
  "/api/users/signIn",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").trim().notEmpty().withMessage("Invalid password"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return next(new BadRequestApiError("Invalid credentials"));
    }
    const passwordMatch = await PasswordService.compare(
      existingUser.password,
      password
    );
    if (!passwordMatch) {
      return next(new BadRequestApiError("Invalid credentials"));
    }
    const userJwt = sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );
    req.session = { jwt: userJwt };
    res.status(200).send(existingUser);
  }
);

authRouter.post("/api/users/signOut", (req, res) => {
  req.session = null;
  res.send({});
});

authRouter.get(
  "/api/users/currentUser",
  currentUser,
  requireAuth,
  (req, res) => {
    res.status(200).send({ currentUser: req.currentUser });
  }
);

export default authRouter;
