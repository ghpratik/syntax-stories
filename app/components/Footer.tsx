import Link from "next/link";
import { Terminal } from "lucide-react";

import { sanityFetch } from "@/sanity/lib/client";
import { CATEGORIES_QUERY } from "@/sanity/lib/queries";
import type { CategoryWithCount } from "@/lib/types";

export async function Footer() {
  const categories =
    (await sanityFetch<CategoryWithCount[]>(CATEGORIES_QUERY)) ?? [];

  return (
    <footer className="mt-16 border-t border-border bg-card/40">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-sm">
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
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Deep dives, tutorials, and stories on software engineering, web
              development, and the craft of writing code.
            </p>
          </div>

          {categories.length > 0 && (
            <div>
              <h2 className="mb-4 text-sm font-semibold">Categories</h2>
              <ul className="grid grid-cols-2 gap-x-8 gap-y-2">
                {categories.slice(0, 8).map((category) => (
                  <li key={category.slug}>
                    <Link
                      href={`/category/${category.slug}`}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {category.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Syntax Stories. All rights reserved.</p>
          <p className="font-mono text-xs">Built with Next.js &amp; Sanity</p>
        </div>
      </div>
    </footer>
  );
}
