import { Check, X } from "lucide-react";
import { ComponentProps } from "react";
import { FieldValues, Path } from "react-hook-form";
import { useFormContext } from "../hook";
import { errorStyles, inputStyles, normalStyles, validStyles } from "./styles";
import clsx from "clsx";

export function Input<T extends FieldValues>({
  name,
  label,
  icon: Icon,
  ...props
}: {
  name: Path<T>;
  label?: string;
  icon?: React.ComponentType<{ className?: string }>;
} & ComponentProps<"input">) {
  const {
    register,
    formState: { errors },
    getFieldState,
  } = useFormContext<T>();

  const fieldState = getFieldState(name);
  const error = errors[name];
  const isValid = !error && fieldState.isDirty;

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-dark">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <input
          {...register(name)}
          {...props}
          className={clsx(
            `${inputStyles} ${Icon ? "pl-10" : ""} ${
              error ? errorStyles : isValid ? validStyles : normalStyles
            }`,
            {
              disabledStyles: props.disabled,
              errorStyles: !!error,
              validStyles: isValid,
              normalStyles: !error && !isValid,
            },
          )}
          aria-invalid={!!error}
        />
        {isValid && (
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-success">
            <Check className="h-5 w-5" />
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-error flex items-center gap-1">
          <X className="h-5 w-5" />
          {String(error.message || "Invalid input")}
        </p>
      )}
    </div>
  );
}
