import type { Metadata } from "next";
import "@/styles/globals.css";

import clsx from "clsx";
import { Knewave, Plus_Jakarta_Sans } from "next/font/google";

import { ContextProvider } from "@/context";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: true,
  preload: true,
  fallback: ["Arial", "Helvetica", "sans-serif"],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ContextProvider>
      <html lang="en">
        <body
          className={clsx(
            jakarta.variable,
            knewave.variable,
            "antialiased w-full min-h-screen",
          )}
        >
          {children}
        </body>
      </html>
    </ContextProvider>
  );
}
