export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AuthError);
    }
  }

  static isAuthError(error: unknown): error is AuthError {
    return (
      error instanceof AuthError ||
      (typeof error === "object" && error !== null && "isAuthError" in error)
    );
  }

  static fromError(error: unknown): AuthError {
    if (this.isAuthError(error)) {
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

    const authError = new AuthError(message);

    if (error instanceof Error && error.stack) {
      authError.stack = `${authError.stack}\nOriginal stack:\n${error.stack}`;
    }

    return authError;
  }
}
