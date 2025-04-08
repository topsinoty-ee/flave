"use client";
import { FormProvider, Submit, TagInput } from "@/context/form";
import { fetchRecipes } from "./server";
import { createAction } from "@/context/form";
import { z } from "zod";

export const MAX_TAGS = 5;

export const Form: React.FC<{ suggestions: Array<string> }> = ({
  suggestions,
}) => {
  const searchSchema = z.object({
    tags: z.array(z.string().max(32)).max(10),
  });

  const searchAction = createAction(searchSchema, async (_, { tags }) => {
    try {
      console.log("Raw tags input:", tags);

      const params = new URLSearchParams();

      if (tags?.length) {
        tags.forEach((tag) => params.append("tags", tag.trim()));
      }

      const query = params.toString();
      console.log("Query string:", query);

      const data = await fetchRecipes(query);

      return {
        success: true,
        message: `${data.length} recipes found`,
        data,
      };
    } catch (error) {
      console.error("Error searching recipes:", error);
      return {
        success: false,
        message: "Failed to search recipes",
        data: [],
      };
    }
  });

  return (
    <FormProvider schema={searchSchema} action={searchAction} className="p-20">
      <TagInput
        name="tags"
        maxTags={MAX_TAGS}
        suggestions={suggestions}
        placeholder="Search recipes..."
        validateTag={(tag) => {
          if (!/^[a-z0-9 ]+$/i.test(tag)) return "Alphanumeric only";
          return true;
        }}
      />
      <Submit className="w-max mt-4">Search</Submit>
    </FormProvider>
  );
};
