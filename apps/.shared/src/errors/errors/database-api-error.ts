import { ApiError } from "./api-error";
import { ErrorResponse } from "./error-response";

export class DatabaseApiError extends ApiError {
  STATUS_CODE = 500;
  ERROR_MESSAGE = "Database error";

  constructor() {
    super("Database error");
  }

  serializeError(): ErrorResponse {
    return {
      errors: [{ message: this.ERROR_MESSAGE }],
    };
  }
}
