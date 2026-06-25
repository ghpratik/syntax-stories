import Link from "next/link";
import { Terminal } from "lucide-react";

import { sanityFetch } from "@/sanity/lib/client";
import { CATEGORIES_QUERY } from "@/sanity/lib/queries";
import type { CategoryWithCount } from "@/lib/types";
import { NavLinks } from "./NavLinks";
import { ThemeToggle } from "./ThemeToggle";

export async function Navbar() {
  const categories =
    (await sanityFetch<CategoryWithCount[]>(CATEGORIES_QUERY)) ?? [];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-mono text-lg font-bold tracking-tight"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Terminal className="h-5 w-5" />
          </span>
          <span>
            syntax<span className="text-primary">.stories</span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <NavLinks categories={categories} />
          <div className="mx-1 hidden h-6 w-px bg-border md:block" />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
