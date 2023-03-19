import { NextFunction, Request, Response } from "express";
import { ApiError } from "../models/api-error";
import { ErrorResponse } from "../models/error-response";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    return res.status(err.STATUS_CODE).send(err.serializeError());
  }
  const error: ErrorResponse = {
    errors: [{ message: err.message }],
  };
  res.status(400).send(error);
};
