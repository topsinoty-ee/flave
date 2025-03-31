import { FieldValues } from "react-hook-form";
import { ZodError, ZodSchema } from "zod";

import { ActionStateFor } from "../types";

export function createAction<InputType extends FieldValues, DataType = unknown>(
  schema: ZodSchema<InputType>,
  action: (payload: InputType) => Promise<ActionStateFor<InputType, DataType>>,
) {
  return async (
    _prevState: ActionStateFor<InputType, DataType> | null,
    formData: FormData,
  ) => {
    try {
      const payload = await schema.parseAsync(
        Object.fromEntries(formData.entries()),
      );
      return await action(payload);
    } catch (error) {
      if (error instanceof ZodError) {
        return {
          success: false,
          fieldErrors: error.formErrors.fieldErrors as Partial<
            Record<keyof InputType, string[]>
          >,
          message:
            "Validation failed " +
            error.errors.map((e) => e.message).join(", "),
        };
      }
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      };
    }
  };
}
