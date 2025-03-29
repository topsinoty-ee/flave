export interface User {
  _id: string;
  userName?: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  role: "User" | "Admin";
  recipes: Array<string>;
  drafts: Array<string>;
  reviews: Array<string>;
  favouritedRecipes: Array<string>;
  weightedTags: Array<{ tags: string; weight: number }>;
  description?: string;
}
