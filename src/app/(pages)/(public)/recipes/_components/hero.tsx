import { TextMask } from "@/components/textMask";

export const Hero = () => (
  <section className="w-full recipes-hero-bg flex flex-col justify-end -mt-15 p-20 h-[calc(100vh-2rem)]">
    <TextMask
      fontFamily="Plus Jakarta Sans"
      fallbackColor="var(--color-foreground)"
      svgWidth={800}
      svgHeight={200}
      className="bg-auto"
    >
      <h1 className="text-9xl font-extrabold">Recipes</h1>
      <h3>Amazing combinations.</h3>
    </TextMask>
  </section>
);
