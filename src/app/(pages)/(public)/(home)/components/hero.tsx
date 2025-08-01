// import { Image } from "@/components";

export const Hero = () => {
  return (
    <section
      style={{ backgroundAttachment: "none" }}
      className="h-[calc(100vh+2rem)] flex w-full section bg-foreground bg-scroll -mt-5 p-0"
    >
      {/* <div className="w-full h-[calc(90%-28px)] bg-black grid grid-cols-3 grid-rows-2">
        <Image src="/NEW-HERO-IMAGE-TOP-1.png" fill priority alt="" />
        <Image
          src="/NEW-HERO-IMAGE-TOP-2.png"
          className="bg-contain p-5"
          fill
          priority
          alt=""
        />
        
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
      </div> */}
      <div className="home-hero-bg w-full h-[calc(90%-28px)] bg-black bg-no-repeat bg-cover" />
    </section>
  );
};
