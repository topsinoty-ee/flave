import { JSX } from "react";
import { RecipeCard, RecipeCardProps } from "../card";
import { SectionHeader, SectionHeaderProps } from "@/components";
import { ClientRecipeDisplay } from "./client";
import Link from "next/link";

const fetchRecipes = async (
  params: string[],
  rows: number,
  signal?: AbortSignal
): Promise<RecipeCardProps[] | null> => {
  const backendUrl = process.env.BACKEND_URL;

  if (!backendUrl) {
    throw new Error("Backend URL not provided");
  }

  try {
    const url = new URL(`${backendUrl}/`);

    if (params.includes("all")) {
      url.pathname = "recipes";
    } else {
      if (!params || params.length === 0) {
        url.pathname = "recipes";
      } else {
        const endpointParam = params.find((param) => param.startsWith("/"));

        if (endpointParam) {
          const [pathname, queryString] = endpointParam.split("?");
          url.pathname = pathname || "recipes/search";
          if (queryString) {
            const queryParamKey = queryString;
            params
              .filter((param) => param !== endpointParam)
              .forEach((param) =>
                url.searchParams.append(queryParamKey, param)
              );
          }
        } else {
          url.pathname = "recipes/search";
          params.forEach((param) => url.searchParams.append("tags", param));
        }
      }
    }

    url.searchParams.append("limit", String(4 * rows));

    const response = await fetch(url.toString(), { signal });

    if (!response.ok) {
      if (response.status === 500) {
        throw new Error("Internal server error");
      }
      throw new Error(
        `HTTP error! status: ${response.status}, URL: ${url.toString()}`
      );
    }

    const recipes = await response.json().then((body) => body.data);

    if (Array.isArray(recipes)) {
      return recipes as RecipeCardProps[];
    } else {
      throw new Error("Invalid response format: expected an array of recipes");
    }
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return null;
    } else {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch recipes"
      );
    }
  }
};

export interface RecipeContentProps {
  params: string[];
  rows: number;
}

export const RecipeContent = async ({
  params,
  rows,
}: RecipeContentProps): Promise<JSX.Element> => {
  const abortController = new AbortController();
  const { signal } = abortController;

  try {
    const recipes = await fetchRecipes(params, rows, signal);

    if (recipes === null) {
      return <span>Fetch was aborted.</span>;
    }

    if (recipes.length === 0) {
      return <span>No recipes found.</span>;
    }

    return (
      <div className="grid grid-cols-4 gap-4">
        {recipes.slice(0, 4 * rows).map((recipe, idx) => (
          <RecipeCard key={`${recipe._id}-${idx}`} {...recipe} />
        ))}
      </div>
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Internal server error") {
      return <div>Internal server error. Please try again later.</div>;
    } else {
      return (
        <span>
          Error:{" "}
          {error instanceof Error ? error.message : "Failed to fetch recipes"}
        </span>
      );
    }
  } finally {
    abortController.abort();
  }
};

interface RecipeDisplayProps extends SectionHeaderProps {
  params: Array<string>;
  endpoint: string | { href: string; text: string };
  rows?: number;
}

export const RecipeDisplayBlock: React.FC<RecipeDisplayProps> = ({
  title,
  description,
  params = [],
  rows = 1,
  endpoint,
}) => (
  <section className="flex flex-col gap-10">
    <SectionHeader title={title} description={description} />
    <ClientRecipeDisplay rows={rows}>
      <RecipeContent params={params} rows={rows} />
      <Link
        href={typeof endpoint === "object" ? endpoint.href : endpoint}
        className="uppercase text-sm font-medium self-end "
      >
        {typeof endpoint === "object" ? endpoint.text : "see more"}
      </Link>
    </ClientRecipeDisplay>
  </section>
);
