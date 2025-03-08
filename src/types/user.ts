export interface User {
  role: "User" | "Admin";
  favouritedRecipes: Array<string>;
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  description: string;
  recipes: Array<string>;
  weightedTags: Array<{ tags: string; weight: number }>;
}
