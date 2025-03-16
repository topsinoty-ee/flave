import { ServerActionResult } from "@/context/form";
import { FieldValues } from "react-hook-form";

export function createFormAction<T extends FieldValues>(
  action: (formData: FormData) => Promise<ServerActionResult<T> | void>,
) {
  return async (
    prevState: ServerActionResult<T> | null,
    formData: FormData,
  ) => {
    const result = await action(formData);
    return result || { message: "Success" };
  };
}
