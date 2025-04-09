import { API } from "@/api";
import { Hero, Form } from "./_components";
import { RecipeDisplayBlock } from "@/components";
import { Tag } from "@/types";
import { Recipe } from "@/types/recipe";
import { validateSession } from "@/context/auth/actions";

export default async function RecipesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Get session and suggestions
  const { sessionToken } = await validateSession({ detailed: true });
  const suggestions = await API.get<Tag[]>("/tags", {
    headers: {
      Authorization: `Bearer ${sessionToken}`,
    },
  })
    .then((tags) => tags.map((tag) => tag.value))
    .catch((reason) => {
      return [JSON.stringify(reason)];
    });

  console.log(suggestions);

  // Handle search params
  const { tags } = await searchParams;
  const params = new URLSearchParams();

  if (tags) {
    if (Array.isArray(tags)) {
      tags.forEach((tag) => params.append("tags", tag));
    } else {
      params.append("tags", tags);
    }
  }

  // Fetch recipes based on search params
  const recipes = await API.get<Recipe[]>(`recipes?${params.toString()}`).catch(
    (reason) => {
      console.log(reason);
      return [];
    },
  );
  console.log("Suggestions: ", suggestions);

  return (
    <>
      <Hero />
      <Form suggestions={suggestions} />
      {params.toString() ? (
        <RecipeDisplayBlock data={recipes || []} limit={0} />
      ) : (
        <RecipeDisplayBlock params={["all"]} limit={0} />
      )}
    </>
  );
}
