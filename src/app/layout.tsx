import type { Metadata } from "next";
import "@/styles/globals.css";
import clsx from "clsx";
import { Knewave, Plus_Jakarta_Sans, Mulish } from "next/font/google";
import { ContextProvider } from "@/context";
import { Navbar, Footer, NavbarProps } from "@/components";
import { validateSession } from "@/context/auth/actions";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: true,
  preload: true,
  fallback: ["Arial", "sans-serif"],
});

const mulish = Mulish({
  weight: ["1000"],
  variable: "--font-mulish",
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: true,
  preload: true,
  fallback: ["Arial"],
});

export const knewave = Knewave({
  variable: "--font-knewave",
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: true,
  preload: true,
  weight: "400",
  fallback: ["Arial", "Helvetica", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Flave",
  description: "Discover and share amazing recipes",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isLoggedIn = await validateSession();

  const navbarProps: NavbarProps = {
    leftLinks: [
      { href: "/recipes", label: "Recipes" },
      { href: "/browse", label: "Browse" },
      { href: "/create", label: "Create" },
    ],
    rightLinks: isLoggedIn
      ? [
          { href: "/profile", label: "Profile" },
          { href: "/favorites", label: "Favourites" },
        ]
      : [
          { href: "/login", label: "Log In" },
          { href: "/signup", label: "Sign Up" },
        ],
  };

  return (
    <ContextProvider>
      <html lang="en">
        <body
          className={clsx(
            jakarta.variable,
            knewave.variable,
            mulish.variable,
            "antialiased min-h-screen bg-background text-black",
          )}
        >
          <Navbar {...navbarProps} />
          {children}
          <Footer />
        </body>
      </html>
    </ContextProvider>
  );
}
