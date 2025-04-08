import { API } from "@/api";
import { Hero, Form } from "./_components";
import { RecipeDisplayBlock } from "@/components";
import { Tag } from "@/types";
import { validateSession } from "@/context/auth/actions";

export default async function Recipes() {
  const { sessionToken } = await validateSession({ detailed: true });
  const suggestions = API.get<Tag[]>("/tags", {
    headers: {
      Authorization: `Bearer ${sessionToken}`,
    },
  });

  console.log("Suggestions: ", suggestions);

  return (
    <>
      <Hero />
      <Form suggestions={(await suggestions).map((tag) => tag.value)} />
      <RecipeDisplayBlock params={["all"]} limit={0} />
    </>
  );
}
