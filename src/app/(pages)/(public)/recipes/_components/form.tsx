"use client";
import { FormProvider, Submit, TagInput } from "@/context/form";
import { createAction } from "@/context/form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { fetchRecipes } from "./server";

export const MAX_TAGS = 5;

export const Form: React.FC<{ suggestions: Array<string> }> = ({
  suggestions,
}) => {
  const router = useRouter();
  const searchSchema = z.object({
    tags: z.array(z.string().max(32)).max(10).optional(),
  });

  const searchAction = createAction(searchSchema, async (_, { tags }) => {
    try {
      const params = new URLSearchParams();

      if (tags?.length) {
        tags.forEach((tag) => params.append("tags", tag.trim()));
      }
      const endpoint = `/recipes?${params.toString()}&matchAll=true`;
      const data = await fetchRecipes(endpoint);

      router.push(endpoint);

      return {
        success: true,
        // message: `Found ${data.length} recipes`,
      };
    } catch (error) {
      console.error("Error updating search:", error);
      return {
        success: false,
        message: "Failed to update search",
      };
    }
  });

  return (
    <FormProvider
      schema={searchSchema}
      action={searchAction}
      className="p-20 search-bar-bg aspect-section-md"
    >
      <div className="lg:max-w-3/5 md:max-w-3/5 flex flex-col gap-5 relative">
        <div>
          <h1>Plenty of recipes</h1>
          <h3>At your fingertips</h3>
        </div>
        <TagInput
          name="tags"
          className=" bg-white"
          maxTags={MAX_TAGS}
          suggestions={suggestions}
          placeholder="Search recipes..."
          validateTag={(tag) => {
            if (!/^[a-z0-9 ]+$/i.test(tag)) return "Alphanumeric only";
            return true;
          }}
        />
      </div>

      <Submit className="w-max mt-4">Search</Submit>
    </FormProvider>
  );
};
