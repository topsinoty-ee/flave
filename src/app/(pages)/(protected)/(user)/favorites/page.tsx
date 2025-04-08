// import { getCurrentUserByKey } from "@/context/auth/actions";
import { RecipeDisplayBlock } from "@/components";
import { Hero } from "./_components/hero";
import { getCurrentUser, validateSession } from "@/context/auth/actions";
import { Recipe } from "@/types/recipe";

export default async function Favorites() {
  const isValid = await validateSession();
  const faves = await getCurrentUser<Recipe[]>("favourites");

  if (!isValid) {
    return <h1 className="text-3xl">User not found</h1>;
  }
  return (
    <>
      <Hero />
      <RecipeDisplayBlock className="bg-black" data={faves || []} />
    </>
  );
}
