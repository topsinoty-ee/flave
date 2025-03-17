"use client";

import clsx from "clsx";
import Link from "next/link";
import { FC } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { Recipe } from "@/types/recipe";

import { Button } from "../button";
import { Image } from "../image";

export type RecipeCardProps = Omit<Recipe, "description">;

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
  ratingsAvg = 0,
  user,
}) => {
  const rating = Math.min(Math.max(ratingsAvg, 0), 5).toFixed(1);

  return (
    <ErrorBoundary fallback={<FallbackComponent />}>
      <Link
        href={`/recipes/${_id}`}
        className="relative w-full overflow-hidden transition-all rounded-md shadow-md cursor-pointer min-w-72 max-w-80 bg-background group hover:shadow-lg"
      >
        <div className="relative w-full aspect-video">
          <Image
            src={src}
            alt={alt || title}
            fill
            className={clsx(
              "object-cover transition-transform duration-300 hover:scale-105 group-hover:scale-105",
            )}
          />
        </div>

        <div className="flex p-5 bg-base">
          <div className="w-full">
            <h6 className="truncate">{title}</h6>

            <span className="text-sm italic text-gray-500">
              {user.firstName} {user.lastName}
            </span>
          </div>

          <div className="flex flex-col justify-end">
            <span className="text-sm whitespace-nowrap">
              {reviews.length > 100
                ? "100+ reviews"
                : `${reviews.length} reviews`}
            </span>
            <span className="self-end font-medium text-primary">
              ★ {rating}
            </span>
          </div>
        </div>
      </Link>
    </ErrorBoundary>
  );
};
