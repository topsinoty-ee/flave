import { ArrowRight } from "lucide-react";

import { Button, RecipeDisplayBlock, SectionHeader } from "@/components";
import { fetchRecipes } from "@/util";

import { CategoryMarquee, Hero, OurFeatures } from "./components";

export default async function Home() {
  return (
    <>
      <Hero />
      <CategoryMarquee
        items={Object.entries({
          veggies: "",
          protein: "",
          dairy: "",
          seafood: "",
          desserts: "",
          smoothies: "",
          "low-calories": "",
        })}
        speed={25}
      />
      <RecipeDisplayBlock
        title={"Currently Hot"}
        description={"Explore what our users have rated highly"}
        params={["all"]}
        seeMore
      />
      <section className="flex aspect-section-lg bg-black">
        <div className="w-full flex items-center justify-center">
          <div className="aspect-[123/100]  bg-black h-full">
            <div className="w-full h-full p-20 flex flex-col items-center justify-center text-center gap-20">
              <h2>Tons of recipes in our database</h2>
              <div className="flex text-center items-center justify-center flex-col gap-10">
                <h4>
                  Interested in contributing? <br />
                  Or looking for more recipes?
                </h4>
                <div className="flex gap-5 uppercase font-extrabold">
                  <Button as="link" shape="square" href="/recipes/browse">
                    Browse recipes
                  </Button>
                  <Button
                    as="link"
                    href="/recipes/create"
                    variant="primary"
                    shape="square"
                  >
                    Create recipe
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="diamond-pattern-bg bg-[47.5%] w-full h-full" />
        </div>
        <div className="aspect-[720/660] bg-cover bg-no-repeat home-food-collage-for-hero-bg" />
      </section>
      <section className="aspect-section gap-10 w-full flex flex-col p-20">
        <SectionHeader title="Customer reviews" />
        <div className="w-full h-full flex justify-evenly gap-5">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="w-full h-full rounded-lg bg-gray-light" />
          ))}
        </div>
      </section>
      <section className="aspect-section-lg gap-10 w-full flex flex-col p-20">
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
