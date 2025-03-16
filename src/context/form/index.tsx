"use client";

import { useEffect, startTransition } from "react";
import { useActionState as useFormState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider as ReactHookFormProvider } from "react-hook-form";
import { z, type ZodObject, type ZodRawShape } from "zod";
import type { DefaultValues, FieldValues } from "react-hook-form";
import clsx from "clsx";
import { defaultTo } from "lodash";

export type ServerActionResult<T extends FieldValues> = {
  errors?: Partial<Record<keyof T, string>>;
  message?: string;
};

type FormProviderProps<T extends ZodObject<ZodRawShape>> = {
  schema: T;
  action: (
    prevState: ServerActionResult<z.infer<T>> | null,
    formData: FormData
  ) => Promise<ServerActionResult<z.infer<T>>>;
  children: React.ReactNode;
  defaultValues?: DefaultValues<z.infer<T>>;
  resetOnSuccess?: boolean;
  className?: string;
  formProps?: React.ComponentProps<"form">;
};

export function FormProvider<T extends ZodObject<ZodRawShape>>({
  schema,
  action,
  children,
  defaultValues,
  resetOnSuccess = true,
  className,
  formProps,
}: FormProviderProps<T>) {
  const [state, formAction] = useFormState(action, null);
  const methods = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    if (state?.errors) {
      methods.setError("root.server", {
        type: "server",
        message: state.message || "Form submission failed",
      });

      // forOwn(state.errors, (message, key) => {
      //   if (has(schema.shape, key)) {
      //     methods.setError(key as Path<z.infer<T>>, {
      //       type: "server",
      //       message: String(message),
      //     });
      //   }
      // });
    }
  }, [state, methods, schema.shape]);

  useEffect(() => {
    if (state?.message && !state?.errors && resetOnSuccess) {
      methods.reset(defaultTo(defaultValues, {}));
    }
  }, [state, methods, resetOnSuccess, defaultValues]);

  const handleFormSubmit = (data: z.infer<T>) => {
    startTransition(() => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      formAction(formData);
    });
  };

  return (
    <ReactHookFormProvider {...methods}>
      <form
        action={formAction}
        onSubmit={methods.handleSubmit(handleFormSubmit)}
        {...formProps}
        className={clsx("w-full", className)}
      >
        {children}
      </form>
    </ReactHookFormProvider>
  );
}
