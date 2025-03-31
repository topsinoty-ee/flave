import { Recipe } from "./recipe";

export interface User {
  _id: string;
  username?: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string | { url: string };
  role: "User" | "Admin";
  recipes: Array<Recipe>;
  savedDrafts: Array<Recipe>;
  reviews: Array<string>;
  favouritedRecipes: Array<Recipe>;
  weightedTags: Array<{ tags: string; weight: number }>;
  description?: string;
}
