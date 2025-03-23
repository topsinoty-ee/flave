"use client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { Button } from "@/components";
import { RecipeDisplayProps } from "./types";

export const ErrorFallback = ({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) => (
  <div role="alert" className="p-4 rounded-lg bg-error-light">
    <h3 className="text-sm font-medium text-error-dark">
      Something went wrong
    </h3>
    <p className="mt-2 text-sm text-error">{error.message}</p>
    <Button
      onClick={resetErrorBoundary}
      className="px-4 py-2 mt-4 text-sm text-white rounded-md bg-error-dark hover:bg-error"
    >
      Retry
    </Button>
  </div>
);

const RecipeSkeletons = ({ rows, grid }: { rows: number; grid?: string }) => (
  <div
    className={grid || "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"}
  >
    {Array.from({ length: 4 * rows }).map((_, idx) => (
      <div key={idx} className="space-y-3 animate-pulse">
        <div className="h-48 bg-gray-light rounded-lg"></div>
        <div className="h-4 bg-gray-light rounded"></div>
        <div className="w-3/4 h-4 bg-gray-light rounded"></div>
        <div className="w-1/2 h-4 bg-gray-light rounded"></div>
      </div>
    ))}
  </div>
);

export const ClientRecipeDisplay = ({
  rows,
  children,
  gridLayout,
}: Pick<RecipeDisplayProps, "rows" | "gridLayout"> & {
  children: React.ReactNode;
}) => (
  <ErrorBoundary
    FallbackComponent={ErrorFallback}
    onReset={() => window.location.reload()}
  >
    <Suspense fallback={<RecipeSkeletons rows={rows || 1} grid={gridLayout} />}>
      {children}
    </Suspense>
  </ErrorBoundary>
);
