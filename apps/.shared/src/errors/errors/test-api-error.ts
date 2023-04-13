import { ValidationError } from "express-validator";
import { ApiError } from "./api-error";
import { ErrorResponse } from "./error-response";

export class TestApiError extends ApiError {
  STATUS_CODE = 400;

  constructor() {
    super("Test error");
  }

  serializeError(): ErrorResponse {
    return {
      errors: [{ message: "Test" }],
    };
  }
}
