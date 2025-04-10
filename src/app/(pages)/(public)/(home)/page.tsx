import { Button, Image, RecipeDisplayBlock } from "@/components";
// import { fetchRecipes } from "@/util";

import { CategoryMarquee, Hero } from "./components";
import { ReviewsList } from "./components/reviews";
import Link from "next/link";

export default async function Home() {
  return (
    <>
      <Hero />
      <CategoryMarquee
        items={Object.entries({
          salads: "/NEW-CATEG-ITEM-3.png",
          soups: "/NEW-CATEG-ITEM-2.png",
          sauces: "/sauce.png",
          keto: "/NEW-CATEG-ITEM-4.png",
          cocktails: "/cocktail.png",
          veggies: "/NEW-CATEG-ITEM-5.png",
          proteins: "/NEW-CATEG-ITEM-6.png",
          seafoods: "/seafood.png",
          "low-calories": "/NEW-CATEG-ITEM-8.png",
          "low-carb": "/NEW-CATEG-ITEM-9.png",
          desserts: "/NEW-CATEG-ITEM-10.png",
          smoothies: "/NEW-CATEG-ITEM-11.png",
          snacks: "/NEW-CATEG-ITEM-12.png",
        })}
        speed={35}
      />
      <RecipeDisplayBlock
        title={"Currently Hot"}
        description={"Explore what our users have rated highly"}
        params={["all"]}
        seeMore
      />
      <section className="flex aspect-section bg-black text-white">
        <div className="w-full flex items-center justify-center">
          <div className="aspect-[123/100]  bg-black h-full">
            <div className="w-full h-full p-20 flex flex-col items-center justify-center text-center gap-20">
              <h2 className="text-white">Tons of recipes in our database</h2>
              <div className="flex text-center items-center justify-center flex-col gap-10">
                <h4 className="text-white">
                  Interested in contributing? <br />
                  Or looking for more recipes?
                </h4>
                <div className="flex gap-5 uppercase font-extrabold">
                  <Button as="link" shape="square" href="/browse">
                    Browse recipes
                  </Button>
                  <Button
                    as="link"
                    href="/create"
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
      <section className="w-full flex gap-20 items=center justify-center p-20">
        {[
          ["/tiktok-card.png", "#"],
          ["/instagram-card.png", "https://www.instagram.com/flavedotee/"],
        ].map((social, index) => (
          <Link key={index} href={social[1] || "#"}>
            <Image
              src={social[0] || ""}
              alt={social[0] || "Social image"}
              quality={100}
            />
          </Link>
        ))}
      </section>
      <ReviewsList />

      {/* <FAQBlock /> */}
    </>
  );
}

// export const revalidate = 300;

// export async function generateStaticParams() {
//   try {
//     const recipes = await fetchRecipes();
//     return recipes.map((recipe) => ({
//       _id: String(recipe._id),
//     }));
//   } catch (error) {
//     console.error("generateStaticParams error:", error);
//     return [];
//   }
// }
