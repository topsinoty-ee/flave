"use client";

import {Logo} from "@/components/logo";
import {Menu, Search} from "lucide-react";
import {useState} from "react";
import clsx from "clsx";
import Link from "next/link";

export const Navbar: React.FC<{ isLoggedIn: boolean }> = ({isLoggedIn}) => {
    const [open, setOpen] = useState(false);
    const mainLinks = {
        "recipes": '/recipes',
        "browse": "/browse",
        "create": "/create",
    };
    const userLinks = {
        "profile": "/profile",
        "favourites": "/favourites"
    }
    const authLinks = {
        "signup": "/signup",
        "login": "/login",
    }
    return <header className={clsx("w-full fixed top-0 z-50 bg-background backdrop-blur-sm h-25",
        open && "h-screen flex flex-col  md:h-25 md:bg-background bg-black transition-all duration-300")}>
        <div className={"w-full h-25 shadow-lg bg-white"}>
            <div className="container mx-auto  h-full relative">
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <Link href={"/"}>
                        <Logo type="light"/>
                    </Link>
                </div>

                <div className={"w-full flex py-7.5 px-5 h-full md:hidden"}>
                    <div className={"flex items-center justify-between w-full"}>
                        <Menu className={"w-10 h-10 cursor-pointer"} onClick={() => setOpen(!open)}/>
                        <Search className={"w-7.5 h-7.5 stroke-2 cursor-pointer"}/>
                    </div>
                </div>
                <div className={"md:w-full hidden md:flex justify-between py-7.5 px-10 h-full"}>
                    <nav className={"flex items-center gap-5"}>
                        {Object.entries(mainLinks).map(([name, href]) => (
                            <Link key={href} href={href}
                                  className={"uppercase font-mulish font-semibold text-base hover:text-lg transition-all"}>{name}</Link>
                        ))}
                    </nav>
                    <nav className={"flex items-center gap-5"}>
                        {Object.entries(isLoggedIn ? userLinks : authLinks).map(([name, href]) => (
                            <Link key={href} href={href}
                                  className={"uppercase font-mulish font-semibold text-base hover:text-lg transition-all"}>{name}</Link>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
        {open && (
            <nav
                className={clsx("w-full md:hidden flex flex-col gap-10  py-20 px-10 items-center opacity-0 transition-all duration-600", open && "h-full opacity-100 ")}>
                {Object.entries({...mainLinks, ...(isLoggedIn ? userLinks : authLinks)}).map(([name, href]) => (
                    <Link key={href} href={href}
                          className={"uppercase font-mulish text-white font-semibold text-xl hover:text-2xl transition-all"}>{name}</Link>
                ))}
            </nav>)
        }

    </header>
}