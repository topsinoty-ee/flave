"use client";
import { useState } from "react";
import { Recipe } from "@/types/recipe";
import { RecipeDisplayBlock } from "@/components";
import { Form } from "./form";

export function RecipesPageContent({ suggestions }: { suggestions: string[] }) {
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);

  return (
    <>
      <Form
        suggestions={suggestions}
        onRecipesFetched={(fetchedRecipes) => setRecipes(fetchedRecipes)}
      />
      <RecipeDisplayBlock
        params={recipes === null ? ["all"] : []}
        data={recipes || []}
        limit={0}
      />
    </>
  );
}
