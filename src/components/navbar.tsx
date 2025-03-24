import { Menu } from "lucide-react";
import Link from "next/link";

import { Button, ButtonProps } from "./button";
import { Logo } from "./logo";

interface NavbarProps {
  links?: Array<{ label: string; href: string }>;
  actions?: Array<ButtonProps>;
}

export const Navbar: React.FC<NavbarProps> = ({ links, actions }) => (
  <header className="relative flex items-center justify-between py-5 shadow-lg rounded-b-3xl bg-background h-25 z-999">
    <div className="flex items-center gap-5">
      {links?.map(({ label, href }, idx) => (
        <Link href={href} key={idx} className="uppercase">
          {label}
        </Link>
      ))}
    </div>
    <Link href="/" className="absolute -translate-x-1/2 left-1/2">
      <Logo />
    </Link>
    <div className="flex items-center gap-5">
      {actions?.map((button, idx) => (
        <Button {...button} as="link" key={idx} />
      ))}
    </div>
  </header>
);
