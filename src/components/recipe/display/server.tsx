import Link from "next/link";
import { JSX } from "react";

import { SectionHeader, SectionHeaderProps } from "@/components";

import { RecipeCard, RecipeCardProps } from "../card";
import { ClientRecipeDisplay } from "./client";

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
    console.log(response);
    if (!response.ok) throw new Error(`Request failed: ${response.status}`);

    const { data } = await response.json();
    console.log(data);
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

export interface RecipeContentProps {
  params: string[];
  rows: number;
}

export const RecipeContent = async ({
  params,
  rows,
}: RecipeContentProps): Promise<JSX.Element> => {
  try {
    const recipes = await fetchRecipes(params, rows);
    console.log(recipes);

    if (!recipes?.length) return <span>No recipes found</span>;

    return (
      <div className="grid grid-cols-4 gap-4">
        {recipes.slice(0, 4 * rows).map((recipe) => (
          <RecipeCard key={recipe._id} {...recipe} />
        ))}
      </div>
    );
  } catch (error) {
    return (
      <div>
        Error loading recipes:{" "}
        {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }
};

interface RecipeDisplayProps extends SectionHeaderProps {
  params: string[];
  endpoint?: string | { href: string; text: string; useParams?: boolean };
  rows?: number;
}

const buildHref = (base: string, params: string[]): string => {
  try {
    const [pathname, search] = base.split("?");
    const paramsObj = new URLSearchParams(search);
    params.forEach((p) => paramsObj.append("tags", p));
    return `${pathname}?${paramsObj.toString()}`.replace(/\?$/, "");
  } catch {
    return base;
  }
};

export const RecipeDisplayBlock: React.FC<RecipeDisplayProps> = ({
  title,
  description,
  params,
  rows = 1,
  endpoint,
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

  console.log("href:", href);

  return (
    <section className="flex flex-col gap-10">
      <SectionHeader title={title} description={description} />
      <ClientRecipeDisplay rows={rows}>
        <RecipeContent params={params} rows={rows} />
        <Link href={href} className="uppercase text-sm font-medium self-end">
          {resolvedEndpoint.text}
        </Link>
      </ClientRecipeDisplay>
    </section>
  );
};
