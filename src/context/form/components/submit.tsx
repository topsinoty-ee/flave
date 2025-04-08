"use client";

import {
  Button,
  ButtonAsButton,
  ButtonAsLink,
  ButtonProps,
} from "@/components/button";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { useFormContext } from "react-hook-form";

interface SubmitButtonProps extends ButtonAsButton {
  isLoading?: boolean;
  loadingText?: string;
}

export function Submit({
  children,
  isLoading,
  loadingText = "Processing...",
  className,
  ...props
}: SubmitButtonProps) {
  const { formState } = useFormContext();
  const { pending } = useFormStatus();

  const isSubmitting = pending || isLoading;
  const isDisabled = !formState.isValid || isSubmitting;

  return (
    <Button
      type="submit"
      disabled={isDisabled}
      aria-disabled={isDisabled}
      className={`transition-all duration-200 ease-in-out bg-black text-white w-full py-2.5 rounded-md 
        ${isDisabled ? "opacity-70 cursor-not-allowed" : "cursor-pointer hover:shadow-md"}
        ${className}`}
      {...props}
    >
      {isSubmitting ? (
        <span className="flex items-center gap-2.5">
          <Loader2 className="h-5 w-5 animate-spin" />
          {loadingText}
        </span>
      ) : (
        children
      )}
    </Button>
  );
}
