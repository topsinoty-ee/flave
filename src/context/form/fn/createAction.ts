// src/context/fn/createAction.ts
import { FieldValues } from "react-hook-form";
import { ZodType as ZodSchema, ZodError } from "zod";
import { ActionState } from "../types";
import { FormDataLike, formDataToObject } from "./formDataHelper";

export function createAction<InputType extends FieldValues>(
  schema: ZodSchema<InputType>,
  action: (
    prevState: ActionState<InputType> | null,
    payload: InputType
  ) => Promise<ActionState<InputType>>
) {
  return async (
    prevState: ActionState<InputType> | null,
    formData: FormData | FormDataLike
  ) => {
    try {
      // Convert FormData to proper object structure
      const entries: Iterable<[string, FormDataEntryValue]> =
        "entries" in formData
          ? (Array.from(formData.entries()) as Iterable<
              [string, FormDataEntryValue]
            >)
          : Array.from(formData);
      const formDataObj = new FormData();
      for (const [key, value] of entries) {
        formDataObj.append(
          key,
          value instanceof Blob && !(value instanceof File)
            ? new File([value], "blob")
            : (value as string | File)
        );
      }

      const parsedData = formDataToObject(formDataObj);
      const payload = await schema.parseAsync(parsedData);

      return await action(prevState, payload);
    } catch (error) {
      if (error instanceof ZodError) {
        return {
          success: false,
          fieldErrors: error.formErrors.fieldErrors as Partial<
            Record<keyof InputType, string[]>
          >,
          message:
            "Validation failed: " +
            error.errors.map((e) => e.message).join(", "),
          data: null,
        };
      }

      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        data: null,
      };
    }
  };
}

// Type helper for action responses
export type ActionReturnType<T extends FieldValues> = Promise<ActionState<T>>;
