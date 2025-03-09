import { Recipe } from "@/types/recipe";

export function isRecipe(obj: unknown): obj is Recipe {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "_id" in obj &&
    typeof obj._id === "string" &&
    "title" in obj &&
    typeof obj.title === "string"
    // &&
    // "src" in obj &&
    // typeof obj.src === "string"
  );
}
