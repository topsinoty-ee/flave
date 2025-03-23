import Image from "next/image";

export const Logo = () => (
  <Image
    width={108}
    height={46}
    className="w-full aspect-[54/23]"
    src="/logo.svg"
    alt="flave logo"
  />
);
