// import { getCurrentUserByKey } from "@/context/auth/actions";
import { RecipeDisplayBlock } from "@/components";
import { Hero } from "./_components/hero";
import { getCurrentUser, validateSession } from "@/context/auth/actions";
import { Recipe } from "@/types/recipe";

export default async function Drafts() {
  const isValid = await validateSession();
  const drafts = await getCurrentUser<Recipe[]>("drafts");

  if (!isValid) {
    return <h1 className="text-3xl">User not found</h1>;
  }
  return (
    <>
      <Hero />
      <RecipeDisplayBlock className="bg-black" data={drafts || []} />
    </>
  );
}
