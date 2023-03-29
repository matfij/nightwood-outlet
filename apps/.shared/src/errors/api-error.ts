import { ErrorResponse } from "./error-response";

export abstract class ApiError extends Error {
  abstract readonly STATUS_CODE: number;

  constructor(message: string) {
    super(message);
  }

  abstract serializeError(): ErrorResponse;
}
