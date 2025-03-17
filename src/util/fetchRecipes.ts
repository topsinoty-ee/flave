import { Recipe } from "@/types/recipe";

import { isRecipe } from "./validators/type-guard";

export async function fetchRecipes(): Promise<Recipe[]> {
  const res = await fetch(`${process.env.BACKEND_URL}/recipes`);
  if (!res.ok) throw new Error("Failed to fetch recipes");
  const { data } = await res.json();
  return data.filter(isRecipe);
}
