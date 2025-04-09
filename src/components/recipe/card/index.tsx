"use client";

import clsx from "clsx";
import Link from "next/link";
import { FC } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { Recipe } from "@/types/recipe";

import { Button } from "../../button";
import { Image } from "../../image";

export * from "./skeleton";
export type RecipeCardProps = Omit<Recipe, "description"> & {
  className?: string;
};

interface CardFallback {
  error?: Error;
  reset?: () => void;
}

const FallbackComponent: FC<CardFallback> = ({ reset, error }) => (
  <div className="w-full p-5 overflow-hidden text-center transition-all rounded-md shadow-md bg-background outline-error min-w-80 max-w-80 hover:shadow-lg">
    <p className="text-sm text-gray-500">Something went wrong.</p>
    {error && <p className="text-xs text-error">{error.message}</p>}
    <Button onClick={reset}>Retry</Button>
  </div>
);

export const RecipeCard: FC<RecipeCardProps> = ({
  _id,
  src,
  alt,
  title,
  reviews = [],
  ratingsAvg,
  ratingsAmount,
  user,
  className,
}) => {
  return (
    <ErrorBoundary fallback={<FallbackComponent />}>
      <Link
        title={title}
        href={`/recipes/${_id}`}
        className={clsx(
          "relative w-full overflow-hidden transition-all rounded-md shadow-md cursor-pointer min-w-72 max-w-80 bg-background group hover:shadow-lg",
          className,
        )}
      >
        <div className="relative w-full aspect-video">
          <Image
            src={typeof src === "object" ? src.url : src}
            alt={alt || title}
            fill
            className={clsx(
              "object-cover transition-transform duration-300 hover:scale-105 group-hover:scale-105",
            )}
          />
        </div>

        <div className="flex p-5 gap-5 w-full overflow-hidden">
          {/* Left content - title and user info */}
          <div className="flex-1 min-w-0 overflow-hidden">
            <h6 className="truncate text-base font-medium text-black">
              {title}
            </h6>
            <span className="text-sm text-gray-dark truncate block">
              {user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : `@${user.username}`}
            </span>
          </div>

          {/* Right content - reviews and rating */}
          <div className="flex flex-col justify-end items-end min-w-[fit-content]">
            <span className="text-sm text-gray-500 whitespace-nowrap">
              {ratingsAmount > 100
                ? "100+ reviews"
                : `${ratingsAmount} ${ratingsAmount === 1 ? "review" : "reviews"}`}
            </span>
            <span className="font-medium text-primary whitespace-nowrap">
              ★ {(ratingsAvg ?? 0).toFixed(1)}{" "}
              {/* Assuming rating is a number */}
            </span>
          </div>
        </div>
      </Link>
    </ErrorBoundary>
  );
};
