import { API } from "@/api/main";
import { DisplayResource } from "../display";
import { SectionHeaderProps } from "../section-header";
import { RecipeCard, RecipeCardProps, RecipeCardSkeleton } from "./card";
import Link from "next/link";

type RecipeDisplayConfig = SectionHeaderProps & {
  params: string[];
  limit?: number;
  fallbackMessage?: string;
  restricted?: string;
  seeMore?:
    | boolean
    | {
        text: string;
        href: string;
      };
};

export const RecipeDisplayBlock: React.FC<RecipeDisplayConfig> = async ({
  params,
  limit = 4,
  fallbackMessage = "No recipes found",
  seeMore,
  ...headerProps
}) => {
  const cleanParams = params.map((param) => param.trim().toLowerCase());
  const hasAllTag = cleanParams.includes("all");

  const endpoint = hasAllTag
    ? `/recipes?sort=averageRating`
    : `/search?${cleanParams
        .map((t) => `tag=${encodeURIComponent(t)}`)
        .join("&")}&limit=${limit}`;

  const recipes = (await API.get<RecipeCardProps[]>(endpoint)) || [];
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
                typeof seeMore === "object" ? seeMore.href : "/recipes/browse"
              }
            >
              {typeof seeMore === "object" ? seeMore.text : "See More"}
            </Link>
          </div>
        ) : null
      }
    />
  );
};
