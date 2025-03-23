// types.ts
import { ReactNode } from "react";
import { RecipeCardProps } from "..";

/**
 * Props for the RecipeContent component.
 */
export interface RecipeContentProps {
  /** Array of parameters/tags to filter recipes */
  params: string[];
  /** Number of rows of recipes to display */
  rows: number;
  /** Optional: Preloaded recipes to display instead of fetching */
  initialRecipes?: RecipeCardProps[];
  /** Optional: Custom ReactNode to display when no recipes are found */
  children?: ReactNode;
}

/**
 * Props for the RecipeDisplayBlock component.
 */
export interface RecipeDisplayProps {
  /** Title for the section */
  title: string;
  /** Description for the section */
  description?: string;
  /** Array of parameters/tags to filter recipes */
  params: string[];
  /** Number of rows of recipes to display (default: 1) */
  rows?: number;
  /** Optional: Custom endpoint configuration for the "See more" link */
  endpoint?: string | { href: string; text: string; useParams?: boolean };
  /** Optional: Preloaded recipes to display instead of fetching */
  initialRecipes?: RecipeCardProps[];
  /** Optional: Custom ReactNode to display when no recipes are found */
  emptyState?: ReactNode;
  /** Optional: Custom grid layout class (default: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4") */
  gridLayout?: string;
}

/**
 * Builds a URL with query parameters.
 * @param base - The base URL or path
 * @param params - Array of parameters to append
 * @returns The constructed URL with query parameters
 */
export type BuildHrefFunction = (base: string, params: string[]) => string;
