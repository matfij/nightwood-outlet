import { ApiError } from "./api-error";
import { ErrorResponse } from "./error-response";

export class BadRequestApiError extends ApiError {
  STATUS_CODE = 400;

  constructor(public message: string) {
    super(message);
  }

  serializeError(): ErrorResponse {
    return {
      errors: [{ message: this.message }],
    };
  }
}
