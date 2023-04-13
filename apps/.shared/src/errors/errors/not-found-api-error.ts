import { ApiError } from "./api-error";
import { ErrorResponse } from "./error-response";

export class NotFoundApiError extends ApiError {
  STATUS_CODE = 404;

  constructor() {
    super("Route not found");
  }

  serializeError(): ErrorResponse {
    return {
      errors: [{ message: "Not found" }],
    };
  }
}
