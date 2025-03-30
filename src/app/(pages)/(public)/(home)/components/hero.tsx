import { Image } from "@/components";

export const Hero = () => {
  return (
    <section className="h-[calc(100vh+2rem)] flex w-full section bg-foreground -mt-5">
      <div className="w-full h-[calc(90%-28px)] bg-black grid grid-cols-3 grid-rows-2">
        <Image src="/NEW-HERO-IMAGE-TOP-1.png" fill priority alt="" />
        <Image
          src="/NEW-HERO-IMAGE-TOP-2.png"
          className="bg-contain p-5"
          fill
          priority
          alt=""
        />

        {/* <div className="bg-black w-full h-full flex flex-col gap-5 p-10 -mt-20">
          <h1 className="lowercase text-8xl leading-snug0  font-extrabold">
            time, money & food.
          </h1>
        </div> */}
        <Image src="/NEW-HERO-IMG-TOP-3.jpg" fill priority alt="" />
        <div className="bg-black w-full h-full flex flex-col gap-5 p-10">
          <h4>Am i weird?</h4>
          <h6>Yes or No</h6>
        </div>
        <Image src="/NEW-HERO-IMAGE-BOT-2.png" fill priority alt="" />
        <div className="bg-black w-full h-full flex flex-col gap-5 p-10">
          <h4>Am i weird?</h4>
          <h6>Yes or No</h6>
        </div>
      </div>
    </section>
  );
};
