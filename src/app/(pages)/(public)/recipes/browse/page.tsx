import { Button, RecipeDisplayBlock } from "@/components";
import { Hero } from "./_components";
import { Marquee } from "./_components/marquee";
import { knewave } from "@/app/layout";

export default async function Browse() {
  return (
    <>
      <Hero />
      <RecipeDisplayBlock
        title={"currently hot"}
        params={["top"]}
        limit={8}
        seeMore={{
          href: "/recipes?filter=top",
        }}
      />
      <RecipeDisplayBlock
        title={"all-time favorites"}
        params={["top-faves"]}
        limit={8}
        seeMore={{
          href: "/recipes?filter=favorites",
        }}
      />
      <Marquee
        items={Object.entries({
          veggies: "",
          protein: "",
          dairy: "",
          seafood: "",
          desserts: "",
          smoothies: "",
          "low-calories": "",
        })}
      />
      <RecipeDisplayBlock
        title={"extra-spicy foods"}
        params={["spicy"]}
        seeMore="tags"
      />
      <RecipeDisplayBlock
        title={"super sweet desserts"}
        params={["sweet", "dessert", "milk", "onion"]}
        seeMore="tags"
      />
      <RecipeDisplayBlock
        title={"Protein-rich foods"}
        params={["protein", "ground beef", "legumes"]}
        seeMore="tags"
      />
      <section className="aspect-section-sm flex flex-col p-20 justify-between bg-[url('/images/NEW-YELLOW-DECAL-FOOTER.png')] bg-cover bg-center bg-yellow bg-no-repeat">
        <div>
          <h3 className={knewave.className}>Feeling inspired perhaps?</h3>
          <small>
            You can create your own recipe and share it to the world!
          </small>
        </div>
        <Button variant="primary">Start now</Button>
      </section>
    </>
  );
}
