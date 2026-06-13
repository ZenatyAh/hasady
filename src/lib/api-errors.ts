export class ApiError extends Error {
  readonly statusCode: number;
  readonly fieldErrors?: Record<string, string[]>;

  constructor(message: string, statusCode = 500, fieldErrors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.fieldErrors = fieldErrors;
  }
}

export function getErrorMessage(error: unknown, fallback = 'حدث خطأ غير متوقع'): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return fallback;
}
