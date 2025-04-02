import { Recipe } from "./recipe";
import { User } from "./user";

export interface Review {
  _id: string;
  recipe: Pick<Recipe, "_id">;
  title: string;
  content: string;
  user: Pick<User, "_id" | "firstName" | "lastName" | "src">;
  rating: number;
}
