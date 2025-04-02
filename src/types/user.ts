import { Recipe } from "./recipe";

export interface User {
  _id: string;
  username?: string;
  firstName: string;
  lastName: string;
  email: string;
  src: string | { url: string };
  role: "User" | "Admin";
  // recipes: Array<Recipe>;
  savedDrafts: Array<Recipe>;
  reviews: Array<string>;
  favouritedRecipes: Array<Recipe>;
  weightedTags: Array<{ tags: string; weight: number }>;
  description?: string;
}

export function isUser(user: unknown): user is User {
  return (
    typeof user === "object" &&
    user !== null &&
    "_id" in user &&
    "username" in user
  );
}
