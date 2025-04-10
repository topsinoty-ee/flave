import Link from "next/link";
import { Logo } from "./logo";

export interface NavbarProps {
  leftLinks?: Array<{ label: string; href: string }>;
  rightLinks?: Array<{ label: string; href: string }>;
}

export const Navbar: React.FC<NavbarProps> = ({
  rightLinks = [],
  leftLinks = [],
}) => (
  <header className="fixed top-0 w-full bg-background backdrop-blur-md shadow z-50 h-20">
    <div className="container mx-auto px-5 sm:px-5 lg:px-10 h-full">
      <div className="flex items-center justify-between h-full">
        <nav className="flex items-center gap-5">
          {leftLinks.map(({ label, href }, idx) => (
            <Link
              href={href}
              key={`left-${idx}`}
              className="font-medium text-sm text-black hover:text-gray-dark transition-colors uppercase"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="absolute left-1/2 -translate-x-1/2">
          <Link href="/" className="flex items-center">
            <Logo type="light" />
          </Link>
        </div>

        <div className="flex items-center gap-5">
          <nav className="hidden md:flex items-center gap-5">
            {rightLinks.map(({ label, href }, idx) => (
              <Link
                href={href}
                key={`right-${idx}`}
                className="font-medium text-sm text-black hover:text-gray-dark transition-colors uppercase"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  </header>
);
