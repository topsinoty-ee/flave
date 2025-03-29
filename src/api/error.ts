export class ApiError extends Error {
  readonly statusCode: number;
  readonly statusText: string;
  readonly data?: unknown;
  readonly timestamp: Date;
  readonly isApiError: true;

  constructor(
    message: string,
    statusCode: number,
    statusText: string = "Unknown Status",
    data?: unknown
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.statusCode =
      Number.isInteger(statusCode) && statusCode >= 100 && statusCode < 600
        ? statusCode
        : 0;

    this.statusText = String(
      statusText || this.getDefaultStatusText(this.statusCode)
    );
    this.data = this.sanitizeData(data);
    this.timestamp = new Date();
    this.isApiError = true;

    Object.defineProperty(this, "isApiError", {
      enumerable: false,
      writable: false,
      configurable: false,
    });

    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }
  }

  private getDefaultStatusText(code: number): string {
    return (
      {
        400: "Bad Request",
        401: "Unauthorized",
        403: "Forbidden",
        404: "Not Found",
        500: "Internal Server Error",
      }[code] || "Unknown Error"
    );
  }

  private sanitizeData(data: unknown): unknown {
    try {
      if (typeof data === "object" && data !== null) return data;
      if (typeof data === "string")
        try {
          return JSON.parse(data);
        } catch {
          return { message: data };
        }
      return data !== undefined ? { value: data } : undefined;
    } catch (error) {
      return { error: "Failed to sanitize error data" };
    }
  }

  static isApiError(error: unknown): error is ApiError {
    return (
      error instanceof ApiError ||
      (typeof error === "object" && error !== null && "isApiError" in error)
    );
  }

  toJSON(): object {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      statusText: this.statusText,
      data: this.data,
      timestamp: this.timestamp.toISOString(),
      stack: this.stack,
    };
  }

  static async fromResponse(response: Response): Promise<ApiError> {
    const responseClone = response.clone();

    try {
      const data = await response.json();
      return new ApiError(
        data?.message || `HTTP Error ${response.status}`,
        response.status,
        response.statusText,
        data
      );
    } catch (error) {
      return new ApiError(
        `HTTP Error ${response.status} (Failed to parse error body)`,
        response.status,
        response.statusText,
        { responseBody: await responseClone.text() }
      );
    }
  }

  static fromError(error: unknown): ApiError {
    if (this.isApiError(error)) {
      return error;
    }

    let message = "Unknown error occurred";
    let data: unknown = undefined;
    let name = "Error";

    if (error instanceof Error) {
      message = error.message || message;
      name = error.name || name;
      data = {
        name: error.name,
        cause: error.cause,
        stack: error.stack,
      };
    } else if (typeof error === "string") {
      message = error;
      data = { message: error };
    } else if (error !== null && typeof error === "object") {
      message = JSON.stringify(error);
      data = error;
    } else {
      message = String(error);
      data = { value: error };
    }

    return new ApiError(message, 0, "Unknown Error", {
      originalError: {
        name,
        ...(typeof data === "object" ? data : { data }),
      },
    });
  }

  isClientError(): boolean {
    return this.statusCode >= 400 && this.statusCode < 500;
  }

  isServerError(): boolean {
    return this.statusCode >= 500 && this.statusCode < 600;
  }
}
