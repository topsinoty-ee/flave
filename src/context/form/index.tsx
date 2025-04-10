"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  createContext,
  startTransition,
  useActionState,
  useEffect,
} from "react";
import {
  useForm,
  Path,
  FormProvider as RHFProvider,
  FieldValues,
} from "react-hook-form";
import { z, ZodObject, ZodRawShape } from "zod";
import { FormContextConfig, FormProviderProps } from "./types";
import clsx from "clsx";

export function createFormContext<
  TFieldValues extends FieldValues = FieldValues,
>() {
  return createContext<FormContextConfig<TFieldValues> | undefined>(undefined);
}

export const FormContext = createFormContext();
export * from "./hook";
export * from "./types";
export * from "./fn/createAction";
export * from "./components";

const appendFormData = (formData: FormData, key: string, value: unknown) => {
  if (value === undefined || value === null) return;

  if (value instanceof Blob) {
    formData.append(key, value);
  } else if (value instanceof Date) {
    formData.append(key, value.toISOString());
  } else if (Array.isArray(value)) {
    value.forEach((item, index) => {
      appendFormData(formData, `${key}[${index}]`, item);
    });
  } else if (typeof value === "object") {
    Object.entries(value).forEach(([subKey, subValue]) => {
      appendFormData(formData, `${key}.${subKey}`, subValue);
    });
  } else {
    formData.append(key, value.toString());
  }
};

export const FormProvider = <Schema extends ZodObject<ZodRawShape>>({
  schema,
  action,
  children,
  defaultValues,
  className,
  onSuccess,
  onError,
  ...rest
}: FormProviderProps<Schema>) => {
  const [state, formAction, isPending] = useActionState(action, null);
  const methods = useForm<z.infer<Schema>>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    if (state?.fieldErrors) {
      Object.entries(state.fieldErrors).forEach(([field, errors]) => {
        methods.setError(field as Path<z.infer<Schema>>, {
          type: "server",
          message: errors?.join(", "),
        });
      });
      onError?.(methods.formState.errors);
    }

    if (state?.success) {
      onSuccess?.(methods.getValues());
    }
  }, [state, methods, onError, onSuccess]);

  const handleSubmit = methods.handleSubmit((data) => {
    const formData = new FormData();
    console.log("data: ", data);
    Object.entries(data).forEach(([key, value]) => {
      appendFormData(formData, key, value);
    });

    console.log("handle SUbmit formdata: ", formData);

    startTransition(() => {
      formAction(formData);
    });
  });

  return (
    <FormContext.Provider value={{ isPending, state }}>
      <RHFProvider {...methods}>
        <form
          onSubmit={handleSubmit}
          className={clsx("transition-all min-h-max", className)}
          {...rest}
        >
          {children}
          {state?.message && (
            <small
              aria-live="polite"
              className="block mt-2 text-sm text-red-600"
            >
              {state.message}
            </small>
          )}
          {process.env.NODE_ENV === "development" ? (
            <pre>{JSON.stringify(state, null, 2)}</pre>
          ) : null}
        </form>
      </RHFProvider>
    </FormContext.Provider>
  );
};
