import { NextFunction, Request, Response } from "express";
import { DatabaseError } from "../models/database-error";
import { ErrorResponse } from "../models/error-response";
import { RequestValidationError } from "../models/request-validation-error";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof RequestValidationError) {
    const formattedErrors = err.errors.map((error) => {
      return {
        message: error.msg,
        field: error.param,
      };
    });
    return res.status(400).send({ errors: formattedErrors });
  }
  if (err instanceof DatabaseError) {
    return res.status(500).send({ errors: [{ message: err.ERROR }] });
  }
  res.status(400).send({ errors: [{ message: err.message }] });
};
