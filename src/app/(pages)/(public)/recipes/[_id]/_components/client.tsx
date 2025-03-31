"use client";

import { ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { Button } from "@/components";

function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <div role="alert" className="p-4 bg-error-light text-error rounded-lg">
      <h2 className="text-lg font-bold">Something went wrong:</h2>
      <p className="mb-4">{error.message}</p>
      <Button
        onClick={resetErrorBoundary}
        className="bg-error-dark text-background"
      >
        Try Again
      </Button>
    </div>
  );
}

export const ClientSide = ({ children }: { children: ReactNode }) => (
  <ErrorBoundary
    FallbackComponent={ErrorFallback}
    onReset={() => window.location.reload()}
  >
    {children}
  </ErrorBoundary>
);
