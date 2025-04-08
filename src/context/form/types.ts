import { ComponentProps } from "react";
import { DefaultValues, FieldErrors, FieldValues } from "react-hook-form";
import { z, ZodObject, ZodRawShape } from "zod";

export interface ActionState<InputType extends FieldValues> {
  success: boolean;
  message?: string;
  fieldErrors?: Partial<Record<keyof InputType, string[]>>;
  error?: string | null;
}

export interface FormProviderProps<Schema extends ZodObject<ZodRawShape>>
  extends Omit<ComponentProps<"form">, "action" | "onSubmit" | "onError"> {
  schema: Schema;
  action: (
    prevState: ActionState<z.infer<Schema>> | null,
    formData: FormData
  ) => Promise<ActionState<z.infer<Schema>>>;
  defaultValues?: DefaultValues<z.infer<Schema>>;
  onSuccess?: (data: z.infer<Schema>) => void;
  onError?: (errors: FieldErrors<z.infer<Schema>>) => void;
}

export interface FormContextConfig<InputType extends FieldValues> {
  isPending: boolean;
  state: ActionState<InputType> | null;
}
