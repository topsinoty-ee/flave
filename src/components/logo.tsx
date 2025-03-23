import Image from "next/image";

export const Logo = () => (
  <div className="h-full logo max-h-20">
    <Image
      width={420}
      height={200}
      className="max-h-20"
      src="/logo.svg"
      alt="flave logo"
    />
  </div>
);
