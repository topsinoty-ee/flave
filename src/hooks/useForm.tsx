"use client";

import { useFormContext } from "react-hook-form";
import { useFormStatus } from "react-dom";
import type { UseFormReturn, FieldValues, FieldError } from "react-hook-form";
import { get } from "lodash";

export function useServerForm<
  TFieldValues extends FieldValues = FieldValues,
>() {
  const methods = useFormContext<TFieldValues>();
  const { pending } = useFormStatus();

  if (!methods) {
    throw new Error("useServerForm must be used within a FormProvider");
  }

  const { formState } = methods;
  const serverError = get(formState.errors, "root.server") as
    | FieldError
    | undefined;

  return {
    ...methods,
    isSubmitting: pending || formState.isSubmitting,
    submitCount: formState.submitCount,
    serverError,
  } satisfies UseFormReturn<TFieldValues> & {
    isSubmitting: boolean;
    submitCount: number;
    serverError?: FieldError;
  };
}
