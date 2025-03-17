import { Menu } from "lucide-react";
import Link from "next/link";

import { Button } from "./button";
import { Logo } from "./logo";

interface NavbarProps {
  links?: Array<{ label: string; href: string }>;
  actions?: Array<{
    label: string;
    href: string;
    type?: "secondary" | "primary" | "disabled";
  }>;
}

export const Navbar: React.FC<NavbarProps> = ({ links, actions }) => (
  <header className="relative flex items-center justify-between py-5 shadow-lg rounded-b-3xl bg-background max-h-16">
    <Menu />
    <Link href="/" className="absolute no-underline -translate-x-1/2 left-1/2">
      <Logo />
    </Link>
    <div className="flex items-center gap-5">
      {links?.map(({ label, href }, idx) => (
        <Link href={href} key={idx} className="link-underline">
          {label}
        </Link>
      ))}
      {actions?.map(({ label, href, type }, idx) => (
        <Button href={href} key={idx} shape="rounded" variant={type}>
          {label}
        </Button>
      ))}
    </div>
  </header>
);
