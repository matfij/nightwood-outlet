export interface ErrorResponse {
  errors: ErrorResponseItem[];
}

export interface ErrorResponseItem {
  message: string;
  field?: string;
}
