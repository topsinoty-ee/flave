import Image from "next/image";

export const OurFeatures = () => {
  return (
    <section className="flex items-center justify-center gap-20 rounded-lg bg-gray-light aspect-section-xs">
      {Object.entries({
        "Make do with ingredients at home": "/images/icons/mortar.png",
        "SAVE TIME BY USING WHAT YOU HAVE": "/images/icons/stopwatch.png",
        "SAVE MONEY BY SHOPPING LESS": "/images/icons/money.png",
      }).map(([text, src]) => {
        return (
          <div key={text} className="flex items-center gap-5 max-w-80">
            <Image
              src={src}
              alt={text}
              width={52}
              height={52}
              className="transition-all"
            />
            <div>
              <h4 className="text-xl font-semibold uppercase">{text}</h4>
            </div>
          </div>
        );
      })}
    </section>
  );
};
