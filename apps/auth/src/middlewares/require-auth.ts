import { NextFunction, Request, Response } from "express";
import { UnauthorizedApiError } from "../models/UnauthorizedApiError";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    return next(new UnauthorizedApiError());
  }
  next();
};
