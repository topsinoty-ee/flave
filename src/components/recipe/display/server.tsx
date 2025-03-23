// RecipeDisplay.tsx
import Link from "next/link";
import { JSX, ReactNode } from "react";

import { SectionHeader, SectionHeaderProps } from "@/components";
import { RecipeCard, RecipeCardProps } from "../card";
import { ClientRecipeDisplay } from "./client";
import {
  RecipeContentProps,
  RecipeDisplayProps,
  BuildHrefFunction,
} from "./types";

/**
 * Fetches recipes from the backend based on parameters.
 * @param params - Array of parameters/tags to filter recipes
 * @param rows - Number of rows of recipes to fetch
 * @param signal - Optional AbortSignal for request cancellation
 * @returns Promise resolving to an array of RecipeCardProps or null
 */
const fetchRecipes = async (
  params: string[],
  rows: number,
  signal?: AbortSignal,
): Promise<RecipeCardProps[] | null> => {
  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl)
    throw new Error("BACKEND_URL environment variable not configured");

  try {
    const url = new URL(`${backendUrl}/recipes/search`);
    const validParams = params.filter((p) => p !== "all" && !p.startsWith("/"));

    if (params.includes("all")) {
      url.pathname = `/recipes`;
    } else if (validParams.length > 0) {
      validParams.forEach((param) => url.searchParams.append("tags", param));
    }

    url.searchParams.append("limit", String(4 * rows));

    const response = await fetch(url.toString(), { signal });
    if (!response.ok) throw new Error(`Request failed: ${response.status}`);

    const { data } = await response.json();
    if (!Array.isArray(data)) throw new Error("Invalid response format");

    return (data as RecipeCardProps[]).sort(
      (a, b) => (b.ratingsAvg ?? 0) - (a.ratingsAvg ?? 0),
    );
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") return null;
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch recipes",
    );
  }
};

/**
 * Builds a URL with query parameters.
 * @param base - The base URL or path
 * @param params - Array of parameters to append
 * @returns The constructed URL with query parameters
 */
const buildHref: BuildHrefFunction = (base, params) => {
  try {
    const [pathname, search] = base.split("?");
    const paramsObj = new URLSearchParams(search);
    params.forEach((p) => paramsObj.append("tags", p));
    return `${pathname}?${paramsObj.toString()}`.replace(/\?$/, "");
  } catch {
    return base;
  }
};

/**
 * Displays a grid of recipes.
 * @param props - RecipeContentProps
 * @returns JSX.Element
 */
export const RecipeContent = async ({
  params,
  rows,
  initialRecipes,
  children,
}: RecipeContentProps): Promise<JSX.Element> => {
  try {
    const recipes = initialRecipes || (await fetchRecipes(params, rows));

    if (!recipes?.length)
      return (
        <div className="text-center py-8">{children || "No recipes found"}</div>
      );

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {recipes.slice(0, 4 * rows).map((recipe) => (
          <RecipeCard key={recipe._id} {...recipe} />
        ))}
      </div>
    );
  } catch (error) {
    return (
      <div className="text-red-500">
        Error loading recipes:{" "}
        {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }
};

/**
 * A complete recipe display block with header, content, and "See more" link.
 * @param props - RecipeDisplayProps
 * @returns JSX.Element
 */
export const RecipeDisplayBlock: React.FC<RecipeDisplayProps> = ({
  title,
  description,
  params,
  rows = 1,
  endpoint,
  initialRecipes,
  emptyState,
  gridLayout = "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
}) => {
  const resolvedEndpoint =
    typeof endpoint === "string"
      ? {
          href: endpoint,
          text: "See more",
          useParams: true,
        }
      : (endpoint ?? {
          href: "/search",
          text: "See more",
          useParams: true,
        });

  const href = resolvedEndpoint.useParams
    ? buildHref(resolvedEndpoint.href, params)
    : resolvedEndpoint.href;

  return (
    <section className="flex flex-col gap-10">
      <SectionHeader title={title} description={description} />
      <ClientRecipeDisplay rows={rows} gridLayout={gridLayout}>
        <RecipeContent
          params={params}
          rows={rows}
          initialRecipes={initialRecipes}
        >
          {emptyState}
        </RecipeContent>
        <Link href={href} className="uppercase text-sm font-medium self-end">
          {resolvedEndpoint.text}
        </Link>
      </ClientRecipeDisplay>
    </section>
  );
};
