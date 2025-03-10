import { RecipeDisplayBlock, Image } from "@/components";
import Link from "next/link";

export default async function Browse() {
  // const images = ["https://placehold.co/600x400"];
  // const options = {
  //   size: { width: 200, height: 200 },
  //   layout: { cols: 2, rows: 2 },
  //   spacing: 10,
  //   backgroundColor: { r: 0, g: 0, b: 0, alpha: 1 }, // Black background
  // };

  // const collageDataUrl = await createCollage(images, options);
  // console.log("Collage Data URL:", collageDataUrl);

  // // You can use the Data URL directly in an HTML <img> tag:
  // // <img src="data:image/png;base64,..." alt="Collage" />
  return (
    <>
      <section className="aspect-section-md w-full bg-foreground rounded-lg flex flex-col p-10">
        <div className="w-[60%] h-full flex flex-col justify-between">
          <div>
            <h1>
              Find the perfect recipe{" "}
              <span className="text-white">for you</span>
            </h1>
            <p>
              Find exactly what you&apos;re looking for with a quick search!
            </p>
          </div>
          <div>
            <div className="rounded-2xl w-full h-10 py-2.5 px-5 bg-gray-light" />
          </div>
        </div>
      </section>
      <section>
        <RecipeDisplayBlock
          params={["all"]}
          title="Currently hot"
          description="Explore what our users have rated highly"
          rows={2}
        />
        <RecipeDisplayBlock
          params={["all"]} // use context to get user's weighted tags
          title="Just for you"
          description="Recipes we recommend to you"
          rows={2}
        />
      </section>
      <section className="flex flex-col gap-10 aspect-section-sm outline-1 outline-yellow bg-black p-10 rounded-lg">
        <div>
          <h2>Hungry for more?</h2>
          <small className="text-gray">
            Check these out! Sure to be a hit.
          </small>
        </div>
        <div className="flex gap-10">
          {Object.entries({
            veggies: "/images/culinary-fallback.png",
            protein: "/images/culinary-fallback.png",
            dairy: "/images/culinary-fallback.png",
            seafood: "/images/culinary-fallback.png",
            desserts: "/images/culinary-fallback.png",
            smoothies: "/images/culinary-fallback.png",
          }).map(([text, src], idx) => {
            return (
              <Link
                href={`search?tags=${text}`}
                key={idx}
                className="flex flex-col items-center w-full gap-5"
              >
                <Image
                  src={src}
                  alt={text}
                  width={100}
                  height={100}
                  className="w-full golden-circle min-w-20 max-w-40 bg-white image-flex justify-center items-center"
                />
                <h5 className="uppercase">{text}</h5>
              </Link>
            );
          })}
        </div>
      </section>
      {/* user weighted tags */}
      {/* <TagImage /> */}
    </>
  );
}
