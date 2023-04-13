import { ApiError } from "./api-error";
import { ErrorResponse } from "./error-response";

export class UnauthorizedApiError extends ApiError {
  STATUS_CODE = 401;

  constructor() {
    super("Unauthorized");
  }

  serializeError(): ErrorResponse {
    return {
      errors: [{ message: "Unauthorized" }],
    };
  }
}
