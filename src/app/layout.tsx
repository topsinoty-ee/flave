import type {Metadata} from "next";
import {Mulish, Plus_Jakarta_Sans} from "next/font/google";
import "./globals.css";
import {Footer, Navbar} from "@/components";
import clsx from "clsx";
import {ReactNode} from "react";

const jakarta = Plus_Jakarta_Sans({
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-next-jakarta",
});

const mulish = Mulish({
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-next-mulish",
});

export const metadata: Metadata = {
    title: "Flave",
    description: "A recipe search engine",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={clsx(jakarta.variable, mulish.variable, jakarta.className, mulish.style, "antialiased flex flex-col h-screen")}
        >
        <Navbar isLoggedIn={false}/>
        <main className={"flex-1 w-full"}>{children}</main>

        <Footer/>
        </body>
        </html>
    );
}
