import { ApiError } from "@/api/error";
import { type ZodIssue } from "zod";

export class ValidationError extends ApiError {
  readonly validationIssues: ZodIssue[];

  constructor(message: string, issues: ZodIssue[]) {
    super(message, 422, "Unprocessable Entity", { issues });
    this.validationIssues = issues;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
