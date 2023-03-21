import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { ValidationApiError } from "../models/validation-api-error";

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ValidationApiError(errors.array()));
  }
  next();
};
