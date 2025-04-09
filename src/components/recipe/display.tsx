import { API } from "@/api";
import { DisplayResource } from "../display";
import { SectionHeaderProps } from "../section-header";
import { RecipeCard, RecipeCardProps } from "./card";
import Link from "next/link";
import { validateSession } from "../../context/auth/actions/validateSession";

type RecipeDisplayConfig = Partial<SectionHeaderProps> & {
  params?: string[];
  limit?: number;
  fallbackMessage?: string;
  restricted?: Record<string, string>;
  exclude?: string[];
  seeMore?: boolean | "tags" | { text?: string; href: string };
  className?: string;
  data?: RecipeCardProps[]; // New prop for manual data input
};

const DEFAULT_RESTRICTIONS = {
  all: "/recipes",
  "top-faves": "/recipes/highest-rated",
  top: "/recipes/recent-top-rated",
};

const getTagsQuery = (params: string[] = []) =>
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
  params = [],
  limit = 4,
  exclude,
  seeMore,
  restricted,
  data: manualData,
  className,
  ...headerProps
}) => {
  let recipes: RecipeCardProps[] = [];
  const { sessionToken } = await validateSession({ detailed: true });

  if (manualData) {
    recipes = manualData;
  } else {
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

    recipes =
      (await API.get<RecipeCardProps[]>(endpoint, {
        headers: { Authorization: `Bearer ${sessionToken}` },
      })) || [];
  }

  const filteredRecipes = recipes.filter(
    (recipe) => !exclude?.includes(recipe._id),
  );
  const slicedRecipes =
    limit > 0 ? filteredRecipes.slice(0, limit) : filteredRecipes;

  const tagsQuery = getTagsQuery(params);

  return (
    <DisplayResource
      Component={RecipeCard}
      data={slicedRecipes}
      className={className}
      itemClassName="max-w-full"
      {...headerProps}
      after={getSeeMoreLink(seeMore, tagsQuery)}
    />
  );
};
