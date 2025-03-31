"use client";

import clsx from "clsx";
import { defaultTo } from "lodash";
import {
  createContext,
  startTransition,
  useActionState,
  useEffect,
} from "react";
import {
  DefaultValues,
  FormProvider as ReactHookFormProvider,
  Path,
  useForm,
} from "react-hook-form";
import { z, ZodObject, ZodRawShape } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { ActionStateFor, FormContextConfig } from "./types";

export const FormContext = createContext<FormContextConfig | undefined>(
  undefined,
);

type FormProviderProps<
  Schema extends ZodObject<ZodRawShape>,
  DataType = unknown,
> = {
  schema: Schema;
  action: (
    _prevState: ActionStateFor<z.infer<Schema>, DataType> | null,
    formData: FormData,
  ) => Promise<ActionStateFor<z.infer<Schema>, DataType>>;
  children: React.ReactNode;
  onSubmit?: (data: z.infer<Schema>) => void;
  defaultValues?: DefaultValues<z.infer<Schema>>;
  className?: string;
  formProps?: React.ComponentProps<"form">;
};

export const FormProvider = <
  Schema extends ZodObject<ZodRawShape>,
  DataType = unknown,
>({
  schema,
  action,
  onSubmit,
  children,
  defaultValues,
  className,
  formProps,
  ...rest
}: FormProviderProps<Schema, DataType>) => {
  const [state, formAction, isPending] = useActionState(action, null);
  const methods = useForm<z.infer<Schema>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    if (state?.fieldErrors) {
      Object.entries(state.fieldErrors).forEach(([field, message]) => {
        if (field === "root") {
          methods.setError("root.server", {
            type: "server",
            message: String(message),
          });
        } else {
          methods.setError(field as Path<z.infer<Schema>>, {
            type: "server",
            message: String(message),
          });
        }
      });
    }

    if (state?.message && !state?.fieldErrors) {
      methods.reset(defaultTo(defaultValues, {}));
    }
  }, [state, methods, defaultValues]);

  const handleSubmit = (data: z.infer<Schema>) => {
    if (onSubmit) {
      onSubmit(data);
    }
    startTransition(() => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value as string | Blob);
      });
      formAction(formData);
    });
  };

  return (
    <FormContext.Provider
      value={{
        isPending,
        state,
      }}
    >
      <ReactHookFormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(handleSubmit)}
          className={clsx(className)}
          {...formProps}
          {...rest}
        >
          {children}
          {state?.message && <small aria-live="polite">{state.message}</small>}
        </form>
      </ReactHookFormProvider>
    </FormContext.Provider>
  );
};

export * from "./fn";
export * from "./hook";
