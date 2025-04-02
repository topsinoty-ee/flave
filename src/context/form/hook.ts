"use client";

import { get } from "lodash";
import { useContext } from "react";
import { useFormStatus } from "react-dom";
import { FieldError, FieldValues, useFormContext } from "react-hook-form";

import { FormContext } from "./";

export const useForm = <
  TypeOfFieldValues extends FieldValues = FieldValues,
>() => {
  const context = useContext(FormContext);
  const methods = useFormContext<TypeOfFieldValues>();
  const { pending } = useFormStatus();

  if (!methods || !context)
    throw new Error("useFormContext must be used within FormProvider");

  const { formState } = methods;
  const error = get(formState.errors, "root.server") as FieldError | undefined;

  return {
    ...methods,
    ...context,
    isSubmitting: pending || context.isPending || formState.isSubmitting,
    submitCount: formState.submitCount,
    error,
    isPending: context.isPending,
    state: context.state,
  };
};
