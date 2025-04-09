"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { useAuth } from "@/context/auth";
import { Button } from "@/components";

interface NavigationProps {
  counts: Partial<{
    reviews: number;
    drafts: number;
    favorites: number;
  }>;
  activeTab?: "reviews" | "comments";
}

export default function ProfileNavigation({
  counts,
  activeTab,
}: NavigationProps) {
  const { logout } = useAuth();
  return (
    <aside className="w-max min-w-[15%] h-full">
      <nav className="rounded-2xl bg-black h-max p-5 w-full">
        <ul className="flex flex-col gap-2.5 w-full">
          <li className="flex justify-between items-baseline gap-2.5 w-full">
            <Link
              href="/profile?tab=reviews"
              className={`capitalize ${activeTab === "reviews" ? "text-primary" : "text-white"}`}
            >
              reviews ({counts.reviews || 0})
            </Link>
          </li>
          <li className="flex justify-between items-baseline gap-2.5 w-full">
            <Link href="/drafts" className="capitalize">
              drafts ({counts.drafts || 0})
            </Link>
            <Link href="/drafts">
              <ExternalLink size={16} />
            </Link>
          </li>
          <li className="flex justify-between items-baseline gap-2.5 w-full">
            <Link href="/favorites" className="capitalize">
              favorites ({counts.favorites || 0})
            </Link>
            <Link href="/favorites">
              <ExternalLink size={16} />
            </Link>
          </li>
          <li className="flex justify-between items-baseline gap-2.5 w-full pt-5">
            <Button
              onClick={() => {
                logout("/");
              }}
              className="capitalize transition-colors"
              variant="danger"
            >
              Logout
            </Button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
