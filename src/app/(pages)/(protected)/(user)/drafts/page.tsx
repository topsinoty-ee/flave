// import { getCurrentUserByKey } from "@/context/auth/actions";
import { RecipeCardProps, RecipeDisplayBlock } from "@/components";
import { Hero } from "./_components/hero";

export default async function Drafts() {
  // const { data: drafts } = await getCurrentUserByKey("drafts");
  const recipes: RecipeCardProps[] = await fetch(
    `${process.env.BACKEND_URL}/recipes`,
  ).then((body) => body.json());

  console.log(recipes);

  return (
    <>
      <Hero />
      <section className="p-10 bg-white shadow rounded-lg">
        <RecipeDisplayBlock title="drafts" params={["all"]} />
      </section>
    </>
  );
}
