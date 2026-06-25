"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { CategoryWithCount } from "@/lib/types";

interface NavLinksProps {
  categories: CategoryWithCount[];
}

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLinks({ categories }: NavLinksProps) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  const links = [
    { href: "/", label: "Home" },
    ...categories.slice(0, 5).map((c) => ({
      href: `/category/${c.slug}`,
      label: c.title,
    })),
  ];

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Desktop nav */}
      <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-foreground",
              isActive(pathname, link.href)
                ? "text-foreground"
                : "text-muted-foreground",
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Mobile trigger */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile panel */}
      {open && (
        <div className="absolute inset-x-0 top-full border-b border-border bg-background/95 backdrop-blur md:hidden">
          <nav
            aria-label="Mobile"
            className="container mx-auto flex max-w-6xl flex-col px-4 py-3"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-3 text-base font-medium transition-colors",
                  isActive(pathname, link.href)
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-muted",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
