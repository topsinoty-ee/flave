"use client";

import { useServerForm } from "@/hooks/useForm";
import { Loader2 } from "lucide-react";
import { Button, ButtonProps } from "../button";
import clsx from "clsx";

interface SubmitButtonProps extends ButtonProps {
  loading?: boolean;
}

export function SubmitButton({
  children,
  loading,
  ...props
}: SubmitButtonProps) {
  const { isSubmitting } = useServerForm();
  const isLoading = loading || isSubmitting;

  return (
    <Button
      type="submit"
      disabled={isLoading}
      className={clsx("cursor-pointer", props.className)}
      {...props}
      variant="secondary"
    >
      {isLoading ? <Loader2 className="animate-spin" /> : children}
    </Button>
  );
}
