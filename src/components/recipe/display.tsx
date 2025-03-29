import { API } from "@/api/main";
import { DisplayResource } from "../display";
import { SectionHeaderProps } from "../section-header";
import { RecipeCard, RecipeCardProps, RecipeCardSkeleton } from "./card";
import Link from "next/link";

type RecipeDisplayConfig = SectionHeaderProps & {
  params: string[];
  limit?: number;
  fallbackMessage?: string;
  restricted?: Record<string, string>;
  seeMore?:
    | boolean
    | "tags"
    | {
        text?: string;
        href: string;
      };
};

const DEFAULT_RESTRICTIONS = {
  all: "/recipes?sort=dateCreated",
  top: "/recipes?sort=ratingsAverage",
  "top-faves": "/recipes?sort=favorites",
};

export const RecipeDisplayBlock: React.FC<RecipeDisplayConfig> = async ({
  params,
  limit = 4,
  fallbackMessage = "No recipes found",
  seeMore,
  restricted,
  ...headerProps
}) => {
  const cleanParams = params.map((param) => param.trim().toLowerCase());

  const finalRestrictions: Record<string, string> = {
    ...DEFAULT_RESTRICTIONS,
    ...(restricted || {}),
  };

  const matchedParam = cleanParams.find((param) => param in finalRestrictions);

  const endpoint =
    matchedParam && finalRestrictions[matchedParam]
      ? finalRestrictions[matchedParam]
      : `/recipes/search?${cleanParams
          .map((t) => `tags=${encodeURIComponent(t)}`)
          .join("&")}&limit=${limit}`;
  console.log("endpoint: ", endpoint);
  const recipes = (await API.get<RecipeCardProps[]>(endpoint || "/")) || [];

  const seeMoreEndpoint = `/recipes/search?${cleanParams
    .map((t) => `tags=${encodeURIComponent(t)}`)
    .join("&")}`;

  if (!recipes.length) return [];

  return (
    <DisplayResource
      Component={RecipeCard}
      data={recipes.slice(0, limit)}
      fallback={fallbackMessage}
      itemClassName="max-w-full"
      {...headerProps}
      after={
        seeMore ? (
          <div className="w-full flex items-center justify-end">
            <Link
              className="font-semibold uppercase"
              href={
                typeof seeMore === "object"
                  ? seeMore.href
                  : seeMore === "tags"
                    ? seeMoreEndpoint
                    : "/recipes/browse"
              }
            >
              {typeof seeMore === "object" && seeMore.text
                ? seeMore?.text
                : "See More"}
            </Link>
          </div>
        ) : null
      }
    />
  );
};
