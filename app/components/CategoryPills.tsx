import Link from "next/link";

import { cn } from "@/lib/utils";
import type { CategoryWithCount } from "@/lib/types";

interface CategoryPillsProps {
  categories: CategoryWithCount[];
  activeSlug?: string | null;
  showAll?: boolean;
}

export function CategoryPills({
  categories,
  activeSlug = null,
  showAll = true,
}: CategoryPillsProps) {
  const baseClass =
    "inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors";

  return (
    <div className="flex flex-wrap gap-2">
      {showAll && (
        <Link
          href="/"
          className={cn(
            baseClass,
            activeSlug === null
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
          )}
        >
          All
        </Link>
      )}
      {categories.map((category) => {
        const active = category.slug === activeSlug;
        return (
          <Link
            key={category.slug}
            href={`/category/${category.slug}`}
            className={cn(
              baseClass,
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            {category.title}
            {typeof category.count === "number" && (
              <span
                className={cn(
                  "text-xs",
                  active ? "text-primary-foreground/70" : "text-muted-foreground/60",
                )}
              >
                {category.count}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
