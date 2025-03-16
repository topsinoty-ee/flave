"use client";

import { useFormContext } from "react-hook-form";

export function ServerError() {
  const {
    formState: { errors },
  } = useFormContext();
  const serverError = errors.root?.server;

  return serverError ? (
    <div role="alert" aria-live="polite" className="text-sm text-error">
      {serverError.message}
    </div>
  ) : null;
}
