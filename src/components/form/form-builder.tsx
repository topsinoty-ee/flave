/**
 * @file A generic form builder component with Zod validation and React Hook Form integration
 * @module FormBuilder
 */

import {
  FieldValues,
  UseFormReturn,
  useForm,
  DefaultValues,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodType } from "zod";
import { InputField, TextareaField } from "@/components";

/**
 * Type definition for form fields
 * @template T - The type of the form values
 *
 * @property {keyof T} name - Field name (must match schema keys)
 * @property {string} label - Display label for the field
 * @property {string} type - Input type (text, email, password, etc.)
 * @property {string} [placeholder] - Custom placeholder text
 * @property {string} [className] - Additional CSS classes for the field
 */
type FormField<T extends FieldValues> = {
  name: keyof T;
  label: string;
  type: string;
  placeholder?: string;
  className?: string;
};

/**
 * Props for the FormBuilder component
 * @template T - The type of the form values
 *
 * @property {ZodType<T>} schema - Zod validation schema
 * @property {FormField<T>[]} fields - Array of field configurations
 * @property {(data: T) => void} onSubmit - Submit handler function
 * @property {DefaultValues<T>} [defaultValues] - Initial form values
 * @property {(field: FormField<T>, methods: UseFormReturn<T>) => React.ReactNode} [renderField] - Custom field renderer
 */
interface FormBuilderProps<T extends FieldValues> {
  schema: ZodType<T>;
  fields: FormField<T>[];
  onSubmit: (data: T) => void;
  defaultValues?: DefaultValues<T>;
  renderField?: (
    field: FormField<T>,
    methods: UseFormReturn<T>
  ) => React.ReactNode;
}

/**
 * Generic form builder component with Zod validation
 * @template T - The type of the form values
 * @type {FC<FormBuilderProps<T>>}
 */
export const FormBuilder = <T extends FieldValues>({
  schema,
  fields,
  onSubmit,
  defaultValues,
  renderField,
}: FormBuilderProps<T>) => {
  const methods = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  return (
    <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name as string}>
          {renderField ? (
            renderField(field, methods)
          ) : field.type === "textarea" ? (
            <TextareaField
              name={field.name as string}
              label={field.label}
              error={methods.formState.errors[field.name]?.message as string}
              className={field.className}
              placeholder={field.placeholder}
            />
          ) : (
            <InputField
              name={field.name as string}
              label={field.label}
              type={field.type}
              error={methods.formState.errors[field.name]?.message as string}
              className={field.className}
              placeholder={field.placeholder}
            />
          )}
        </div>
      ))}
      <button
        type="submit"
        className="w-full bg-brand-accent-green text-white py-2 px-4 rounded-md hover:bg-brand-accent-green-dark transition-colors"
      >
        Submit
      </button>
    </form>
  );
};
