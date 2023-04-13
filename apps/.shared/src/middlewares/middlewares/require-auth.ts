import { NextFunction, Request, Response } from "express";
import { UnauthorizedApiError } from "../../errors/errors/unauthorized-api-error";

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
