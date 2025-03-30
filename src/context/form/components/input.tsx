"use client";

import clsx from "clsx";
import { get } from "lodash";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { useRef, useState } from "react";

import { useForm } from "../hook";

import type { ComponentProps } from "react";
import type { FieldValues, Path, FieldError } from "react-hook-form";
type FormInputProps<TypeOfFieldValues extends FieldValues = FieldValues> =
  ComponentProps<"input"> & {
    name: Path<TypeOfFieldValues>;
    label?: string;
    type?: "text" | "email" | "password" | "number";
    icon?: React.ComponentType<{ className?: string }>;
    iconPosition?: "start" | "end";
    labelClass?: string;
    inputClass?: string;
    errorClass?: string;
    containerClass?: string;
    hideErrorMessage?: boolean;
  };

export const FormInput = <TypeOfFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  type = "text",
  icon: Icon,
  iconPosition = "start",
  labelClass,
  inputClass,
  errorClass,
  containerClass,
  className,
  hideErrorMessage = false,
  onBlur: customOnBlur,
  onFocus: customOnFocus,
  ...props
}: FormInputProps<TypeOfFieldValues>) => {
  const {
    register,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isPassword = type === "password";
  const fieldError = get(errors, name) as FieldError | undefined;
  const shouldShowError = fieldError && isTouched;
  const { ref, onBlur: fieldOnBlur, ...fieldProps } = register(name);

  const handlePasswordToggle = () => {
    setShowPassword((prev) => !prev);
    inputRef.current?.focus();
  };

  return (
    <div className={clsx("w-full flex flex-col gap-2.5", containerClass)}>
      {label && (
        <label
          htmlFor={name}
          className={clsx(
            "block text-base font-medium text-gray-dark",
            labelClass,
          )}
        >
          {label}
        </label>
      )}

      <div className="relative rounded-md shadow-sm">
        {Icon && iconPosition === "start" && (
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none transition-transform duration-200">
            <Icon className="h-5 w-5 text-gray" aria-hidden="true" />
          </div>
        )}

        <input
          {...fieldProps}
          ref={(e) => {
            ref(e);
            inputRef.current = e;
          }}
          id={name}
          type={isPassword ? (showPassword ? "text" : "password") : type}
          aria-invalid={fieldError ? "true" : "false"}
          aria-describedby={shouldShowError ? `${name}-error` : undefined}
          onBlur={(e) => {
            setIsTouched(true);
            fieldOnBlur(e);
            customOnBlur?.(e);
          }}
          onFocus={(e) => {
            customOnFocus?.(e);
          }}
          className={clsx(
            "block w-full rounded-md border px-2.5 py-2.5 shadow-sm focus:outline-none transition-all duration-200 ease-in-out text-sm",
            {
              "border-gray-light focus:border-success focus:ring-2 focus:ring-success-light":
                !fieldError,
              "border-red-300 focus:border-error focus:ring-2 focus:ring-error-light":
                fieldError,
              "pl-10": Icon && iconPosition === "start",
              "pr-10": (Icon && iconPosition === "end") || isPassword,
            },
            "password",
            inputClass,
            className,
          )}
          {...props}
        />

        <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 gap-2.5">
          {Icon && iconPosition === "end" && (
            <div className="pointer-events-none transition-transform duration-200">
              <Icon className="h-5 w-5 text-gray" aria-hidden="true" />
            </div>
          )}

          {isPassword && (
            <button
              type="button"
              onClick={handlePasswordToggle}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="p-1 text-gray hover:text-yellow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-light rounded-sm"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          )}

          {shouldShowError && (
            <AlertCircle
              className="h-5 w-5 stroke-error transition-opacity duration-300"
              aria-hidden="true"
            />
          )}
        </div>
      </div>

      {!hideErrorMessage && shouldShowError && (
        <p
          id={`${name}-error`}
          role="alert"
          aria-live="polite"
          className={clsx(
            "text-xs text-error-dark transition-opacity duration-300 message",
            errorClass,
          )}
        >
          {fieldError.message}
        </p>
      )}
    </div>
  );
};
