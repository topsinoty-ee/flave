import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import clsx from "clsx";
import "@/styles/globals.css";
import { ContextProvider } from "@/context";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta-sans",
  subsets: ["latin"],
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
          className={clsx(jakarta.variable, " antialiased w-full min-h-screen")}
        >
          {children}
        </body>
      </html>
    </ContextProvider>
  );
}
