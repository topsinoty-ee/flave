import { API } from "@/api/main";
import { DisplayResource } from "../display";
import { SectionHeaderProps } from "../section-header";
import { RecipeCard, RecipeCardProps } from "./card";
import Link from "next/link";

type RecipeDisplayConfig = Partial<SectionHeaderProps> & {
  params: string[];
  limit?: number;
  fallbackMessage?: string;
  restricted?: Record<string, string>;
  exclude?: string[];
  seeMore?: boolean | "tags" | { text?: string; href: string };
};

const DEFAULT_RESTRICTIONS = {
  all: "/recipes?sort=dateCreated",
  top: "/recipes?sort=ratingsAverage",
  "top-faves": "/recipes?sort=favorites",
};

const getTagsQuery = (params: string[]) =>
  params.map((t) => `tags=${encodeURIComponent(t)}`).join("&");

const getSeeMoreLink = (
  seeMore: RecipeDisplayConfig["seeMore"],
  tagsQuery: string,
) => {
  if (!seeMore) return null;

  const href =
    typeof seeMore === "object"
      ? seeMore.href
      : seeMore === "tags"
        ? `/recipes?${tagsQuery}`
        : "/recipes/browse";

  const text = typeof seeMore === "object" ? seeMore.text : "See More";

  return (
    <div className="w-full flex items-center justify-end">
      <Link className="font-semibold uppercase" href={href}>
        {text}
      </Link>
    </div>
  );
};

export const RecipeDisplayBlock: React.FC<RecipeDisplayConfig> = async ({
  params,
  limit = 4,
  exclude,
  seeMore,
  restricted,
  ...headerProps
}) => {
  const cleanParams = params.map((p) => p.trim().toLowerCase());
  const finalRestrictions = { ...DEFAULT_RESTRICTIONS, ...restricted };
  const matchedParam = cleanParams.find(
    (param): param is keyof typeof finalRestrictions =>
      param in finalRestrictions,
  );
  const tagsQuery = getTagsQuery(cleanParams);

  const endpoint = matchedParam
    ? finalRestrictions[matchedParam]
    : `/recipes?${tagsQuery}${limit > 0 ? `&limit=${limit}` : ""}`;

  const recipes = (await API.get<RecipeCardProps[]>(endpoint)) || [];

  const filteredRecipes = recipes.filter(
    (recipe) => !exclude?.includes(recipe._id),
  );
  const slicedRecipes =
    limit > 0 ? filteredRecipes.slice(0, limit) : filteredRecipes;

  if (!slicedRecipes.length) return null;

  return (
    <DisplayResource
      Component={RecipeCard}
      data={slicedRecipes}
      itemClassName="max-w-full"
      {...headerProps}
      after={getSeeMoreLink(seeMore, tagsQuery)}
    />
  );
};
