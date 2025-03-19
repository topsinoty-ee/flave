import { FieldValues } from "react-hook-form";
import { ZodError, ZodSchema } from "zod";

import { ActionStateFor } from "../types";

export function createAction<InputType extends FieldValues>(
  schema: ZodSchema<InputType>,
  action: (data: InputType) => Promise<Partial<ActionStateFor<InputType>>>,
) {
  return async (
    _prevState: ActionStateFor<InputType> | null,
    formData: FormData,
  ) => {
    try {
      const data = await schema.parseAsync(
        Object.fromEntries(formData.entries()),
      );
      return await action(data);
    } catch (error) {
      if (error instanceof ZodError) {
        return {
          success: false,
          fieldErrors: error.formErrors.fieldErrors as Partial<
            Record<keyof InputType, string>
          >,
          message: "Validation failed",
        };
      }
      return {
        success: false,
        message: "An unexpected error occurred",
      };
    }
  };
}
