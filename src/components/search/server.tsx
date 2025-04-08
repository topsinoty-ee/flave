import { createAction } from "@/context/form";
import { z } from "zod";

export const SearchSchema = z.object({
  tags: z.array(z.string()).optional(),
  sortBy: z.enum(["relevance", "date", "rating"]).default("relevance"),
  matchAll: z.boolean().optional(),
  filters: z.record(z.boolean()).optional(),
});
export const searchAction = createAction(SearchSchema, async (_, formData) => {
  console.log(formData);
  return {
    success: true,
    message: "Search action completed successfully",
  };
});
