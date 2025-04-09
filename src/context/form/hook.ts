import { useContext } from "react";
import {
  FieldValues,
  useFormContext as useRHFormContext,
  Path,
  DefaultValues,
} from "react-hook-form";
import { FormContext } from ".";

export const useFormContext = <
  TFieldValues extends FieldValues = FieldValues,
>() => {
  const context = useContext(FormContext);
  const methods = useRHFormContext<TFieldValues>();

  if (!context || !methods) {
    throw new Error("useFormContext must be used within a FormProvider");
  }

  const { formState } = methods;
  const serverError = formState.errors.root?.server as FieldValues | undefined;
  const isSubmitting = formState.isSubmitting || context.isPending;

  return {
    ...methods,
    ...context,
    isSubmitting,
    serverError,
    submitCount: formState.submitCount,
    state: context.state,
    setError: (name: Path<TFieldValues>, error: FieldValues) => {
      methods.setError(name, error);
    },
    clearErrors: (name?: Path<TFieldValues>) => {
      methods.clearErrors(name);
    },
    setValue: (
      name: Path<TFieldValues>,
      value: TFieldValues[Path<TFieldValues>],
      options?: { shouldValidate?: boolean; shouldDirty?: boolean },
    ) => {
      methods.setValue(name, value, options);
    },
    getValues: (name: Path<TFieldValues>) => {
      return methods.getValues(name);
    },
    reset: (values?: DefaultValues<TFieldValues>) => {
      methods.reset(values);
    },
    setFocus: (name: Path<TFieldValues>) => {
      methods.setFocus(name);
    },
    trigger: (name?: Path<TFieldValues> | Path<TFieldValues>[]) => {
      return methods.trigger(name);
    },
    getFieldState: (name: Path<TFieldValues>) => {
      return methods.getFieldState(name);
    },
    getFieldProps: (name: Path<TFieldValues>) => {
      return methods.register(name);
    },
  };
};
