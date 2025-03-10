import { Button, RecipeDisplayBlock, SectionHeader } from "@/components";
import { Categories, Hero, OurFeatures } from "./components";
import { ArrowRight } from "lucide-react";
import { fetchRecipes } from "@/util";

export default async function Home() {
  return (
    <>
      <Hero />
      <OurFeatures />
      <Categories />
      <RecipeDisplayBlock
        title={"Currently Hot"}
        description={"Explore what our users have rated highly"}
        params={["all"]}
        endpoint={{ href: "/recipes/browse", text: "Browse all" }}
      />
      <section className="w-full bg-yellow rounded-lg flex aspect-section-md">
        <div className="w-full" />
        <div className="w-full h-full flex flex-col justify-between">
          <div className="flex flex-col gap-2.5">
            <h2 className="uppercase">Want to upload your own recipes?</h2>
            <p>Start now. It&apos;s simple really</p>
          </div>
          <div className="flex flex-col gap-5">
            <Button
              className=""
              variant="primary"
              as="link"
              href="/recipes/browse"
              icon={<ArrowRight />}
            >
              Get started
            </Button>
            <small>You can save your recipe as a draft and edit it later</small>
          </div>
        </div>
      </section>
      <section className="aspect-section gap-10 w-full flex flex-col">
        <SectionHeader title="Customer reviews" />
        <div className="w-full h-full flex justify-evenly gap-5">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="w-full h-full rounded-lg bg-gray-light" />
          ))}
        </div>
      </section>
      <section className="aspect-section-lg gap-10 w-full flex flex-col">
        <SectionHeader title="Frequently asked questions" />
        <div className="w-full h-full flex flex-col justify-evenly gap-5">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="w-full h-full rounded-lg bg-gray-light" />
          ))}
          <small className="text-gray-dark">
            If you happen to have any other questions, feel free to contact us.
            Contact details can be found below.
          </small>
        </div>
      </section>
    </>
  );
}

export const revalidate = 300;

export async function generateStaticParams() {
  try {
    const recipes = await fetchRecipes();
    return recipes.map((recipe) => ({
      _id: String(recipe._id),
    }));
  } catch (error) {
    console.error("generateStaticParams error:", error);
    return [];
  }
}
