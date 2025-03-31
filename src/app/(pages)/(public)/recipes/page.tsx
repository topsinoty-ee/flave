import { SearchForm } from "@/components/search";
import { Hero } from "./_components";
import { RecipeDisplayBlock } from "@/components";

export default async function Recipes() {
  return (
    <>
      <Hero />
      <SearchForm />
      <RecipeDisplayBlock params={["all"]} limit={0} />
    </>
  );
}
