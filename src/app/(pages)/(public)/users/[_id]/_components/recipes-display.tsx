import { DisplayResource, RecipeCard } from "@/components";
import { Recipe } from "@/types/recipe";

export const RecipeDisplayBlock = ({ recipes }: { recipes: Array<Recipe> }) => {
  console.log(recipes ?? []);
  return <DisplayResource Component={RecipeCard} data={recipes || []} />;
  //   return <pre>{JSON.stringify(recipes)}</pre>;
};
