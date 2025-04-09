// import { getCurrentUserByKey } from "@/context/auth/actions";
import { RecipeDisplayBlock } from "@/components";
import { Hero } from "./_components/hero";
import { getCurrentUser, validateSession } from "@/context/auth/actions";
import { Recipe } from "@/types/recipe";
import clsx from "clsx";

export default async function Drafts() {
  const isValid = await validateSession();
  const drafts = await getCurrentUser<Recipe[]>("drafts").catch((reason) => {
    console.log(reason);
    return [];
  });

  if (!isValid) {
    return <h1 className="text-3xl">User not found</h1>;
  }
  return (
    <>
      <Hero />
      <section
        className={clsx({
          "bg-black w-full itmes-center justify center": !!drafts,
        })}
      >
        <RecipeDisplayBlock className="bg-black" data={drafts || []} />
      </section>
    </>
  );
}
