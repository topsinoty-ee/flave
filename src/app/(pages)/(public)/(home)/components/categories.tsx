import Image from "next/image";

export const Categories = () => {
  return (
    <section className="flex gap-10">
      {Object.entries({
        veggies: "/images/culinary-fallback.png",
        protein: "/images/culinary-fallback.png",
        dairy: "/images/culinary-fallback.png",
        seafood: "/images/culinary-fallback.png",
        desserts: "/images/culinary-fallback.png",
        smoothies: "/images/culinary-fallback.png",
        "low-calorie": "/images/culinary-fallback.png",
      }).map(([text, src], idx) => {
        return (
          <div key={idx} className="flex flex-col items-center w-full gap-5">
            <Image
              src={src}
              alt={text}
              width={100}
              height={100}
              className="w-full golden-circle min-w-20 max-w-40"
            />
            <h5 className="uppercase">{text}</h5>
          </div>
        );
      })}
    </section>
  );
};
