import type {Metadata} from "next";
import "@/styles/globals.css";
import clsx from "clsx";
import {Knewave, Plus_Jakarta_Sans, Mulish} from "next/font/google";
import {ContextProvider} from "@/context";
import {Navbar, Footer, NavbarProps} from "@/components";
import {validateSession} from "@/context/auth/actions";

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
      {href: "/recipes", label: "Recipes"},
      {href: "/browse", label: "Browse"},
      {href: "/create", label: "Create"},
    ],
    rightLinks: isLoggedIn
      ? [
        {href: "/profile", label: "Profile"},
        {href: "/favorites", label: "Favourites"},
      ]
      : [
        {href: "/login", label: "Log In"},
        {href: "/signup", label: "Sign Up"},
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
      <div className="md:block hidden">{children}      </div>
      <div
        className="w-full h-screen md:hidden flex flex-col items-center justify-center bg-background p-4 text-center">
        <div className="max-w-md mx-auto">
          <h1 className={`${knewave.className} text-4xl text-primary mb-4`}>
            🍳 Flave
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Whoops! Our kitchen is currently optimized for larger screens.
          </p>
          <div className="space-y-2 text-gray-500">
            <p>Please visit us from your desktop computer</p>
            <p>to browse and create delicious recipes!</p>
          </div>
          <div className="mt-8 text-3xl">
            📱👩🍳
          </div>
        </div>
      </div>
      <Footer/>
      </body>
      </html>
    </ContextProvider>
  );
}
