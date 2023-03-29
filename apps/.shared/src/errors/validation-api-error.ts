import { ValidationError } from "express-validator";
import { ApiError } from "./api-error";
import { ErrorResponse } from "./error-response";

export class ValidationApiError extends ApiError {
  STATUS_CODE = 400;

  constructor(public errors: ValidationError[]) {
    super("Validation error");
  }

  serializeError(): ErrorResponse {
    return {
      errors: this.errors.map((error) => {
        return { message: error.msg, field: error.param };
      }),
    };
  }
}
