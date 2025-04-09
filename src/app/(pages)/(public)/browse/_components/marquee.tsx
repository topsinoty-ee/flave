import React from "react";
import { Image, SectionHeader } from "@/components";

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
    <h5 className="uppercase truncate max-w-[90%] text-white">{text}</h5>
  </div>
);

export const Marquee: React.FC<CategoryMarqueeProps> = ({
  items,
  speed = 30,
}) => {
  if (!items.length) return null;

  const loopItems = [...items, ...items, ...items, ...items];

  return (
    <section className="flex flex-col gap-10 py-10 bg-black">
      <SectionHeader
        className="px-20"
        title="Hungry for more?"
        description="Check these out! Sure to be a hit."
      />
      <div className="relative overflow-hidden">
        {/* Edge mask */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-25 bg-gradient-to-r from-black to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-25 bg-gradient-to-l from-black to-transparent z-10" />

        <div
          style={{ "--speed": `${speed}s` } as React.CSSProperties}
          className="flex w-max gap-5 animate-marquee hover:slow-on-hover will-change-auto"
          aria-hidden
        >
          {loopItems.map(([text, src], index) => (
            <MarqueeItem key={`${text}-${index}`} text={text} src={src} />
          ))}
        </div>
      </div>
    </section>
  );
};
