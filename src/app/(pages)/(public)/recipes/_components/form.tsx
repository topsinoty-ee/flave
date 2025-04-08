"use client";
import { FormProvider, Submit, TagInput } from "@/context/form";
import { createAction } from "@/context/form";
import { z } from "zod";
import { useRouter } from "next/navigation";

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

      router.push(`/recipes?${params.toString()}&matchAll=true`);

      return {
        success: true,
        message: "Searching recipes...",
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
