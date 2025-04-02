import { Review } from "./review";
import { User } from "./user";

import type { Tag } from "./tag";
type Ingredient = {
  value: string;
  quantity: number;
  _id: string;
};

export type Recipe = {
  _id: string;
  alt: string;
  src: string | { url: string };
  title: string;
  description: string;
  portions: number;
  cookingDuration: number;
  cookingMethod: Array<string>;
  ingredients: Array<Ingredient>;
  instructions: Array<string>;
  categories: Array<string>;
  tags: Array<Tag>;
  user: Pick<User, "_id" | "firstName" | "lastName" | "src">;
  reviews: Array<Review>;
  ratingsAmount: number;
  ratingsAvg: number;
  draft: boolean;
};
