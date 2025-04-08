import { API } from "@/api";
import { Hero } from "./_components";
import { Tag } from "@/types";
import { validateSession } from "@/context/auth/actions";
import { RecipesPageContent } from "./_components/recipe-display";

export default async function Recipes() {
  const { sessionToken } = await validateSession({ detailed: true });
  const suggestions = API.get<Tag[]>("/tags", {
    headers: {
      Authorization: `Bearer ${sessionToken}`,
    },
  });

  console.log("Suggestions: ", await suggestions);

  return (
    <>
      <Hero />
      <RecipesPageContent
        suggestions={(await suggestions).map((tag) => tag.value)}
      />
    </>
  );
}
