import { Button, RecipeDisplayBlock } from "@/components";
import { Hero } from "./_components";
import { Marquee } from "./_components/marquee";
import { knewave } from "@/app/layout";
import { validateSession } from "@/context/auth/actions";

export default async function Browse() {
  const isLoggedIn = await validateSession();
  return (
    <>
      <Hero />
      <RecipeDisplayBlock
        title={"currently hot"}
        params={["top"]}
        limit={8}
        className="pb-0"
      />
      {isLoggedIn && (
        <RecipeDisplayBlock
          title={"made for you"}
          params={["made for you"]}
          limit={8}
          className="pb-0"
          restricted={{ "made for you": "/recipes/asort" }}
        />
      )}
      <RecipeDisplayBlock
        title={"all-time favorites"}
        params={["top-faves"]}
        limit={8}
      />
      <Marquee
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
        title={"extra-spicy foods"}
        params={[
          "spicy",
          "pepper",
          "black pepper",
          "wasabi",
          "chili",
          "ginger",
          "curry powder",
          "garlic",
        ]}
        className="pb-0"
        limit={8}
      />
      <RecipeDisplayBlock
        title={"super sweet desserts"}
        params={["sweet", "dessert", "milk", "onion"]}
        limit={8}
        className="pb-0"
      />
      <RecipeDisplayBlock
        title={"Protein-rich foods"}
        params={["protein", "ground beef", "legumes", "chicken"]}
        limit={8}
      />
      <section className="aspect-section-sm flex flex-col p-20 justify-between bg-[url('/images/NEW-YELLOW-DECAL-FOOTER.png')] bg-cover bg-center bg-yellow bg-no-repeat">
        <div>
          <h2 className={knewave.className}>Feeling inspired perhaps?</h2>
          <small>
            You can create your own recipe and share it to the world!
          </small>
        </div>
        <Button variant="primary" className="w-max">
          Start now
        </Button>
      </section>
    </>
  );
}
