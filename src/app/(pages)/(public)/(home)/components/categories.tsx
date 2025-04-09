import React from "react";
import { Image } from "@/components";

type CategoryItem = [string, string];

interface CategoryMarqueeProps {
  items: CategoryItem[];
  speed?: number;
}

const MarqueeItem: React.FC<{ text: string; src: string }> = ({
  text,
  src,
}) => (
  <div className="flex flex-col items-center gap-2.5 w-60 px-5">
    <div className="relative aspect-square w-full overflow-hidden golden-circle rounded-full">
      <Image src={src} alt={text || "Category image"} fill quality={95} />
    </div>
    <h5 className="uppercase truncate max-w-[90%]">{text}</h5>
  </div>
);

export const CategoryMarquee: React.FC<CategoryMarqueeProps> = ({
  items,
  speed = 30,
}) => {
  if (!items.length) return null;

  const loopItems = [...items, ...items, ...items, ...items];

  return (
    <section className="relative overflow-hidden py-10">
      {/* Edge mask */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />

      <div
        style={{ "--speed": `${speed}s` } as React.CSSProperties}
        className="flex w-max animate-marquee hover:slow-on-hover will-change-auto"
        aria-hidden
      >
        {loopItems.map(([text, src], index) => (
          <MarqueeItem key={`${text}-${index}`} text={text} src={src} />
        ))}
      </div>
    </section>
  );
};
