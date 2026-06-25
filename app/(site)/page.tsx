import Link from "next/link";

import { sanityFetch } from "@/sanity/lib/client";
import {
  CATEGORIES_QUERY,
  FEATURED_POSTS_QUERY,
  POPULAR_POSTS_QUERY,
  RECENT_POSTS_QUERY,
} from "@/sanity/lib/queries";
import type { CategoryWithCount, PostCard } from "@/lib/types";
import BlogCard from "@/app/components/BlogCard";
import { SectionHeading } from "@/app/components/SectionHeading";
import { CategoryPills } from "@/app/components/CategoryPills";

// Statically generate at build time and refresh via ISR.
export const revalidate = 60;

export default async function IndexPage() {
  const [featured, recent, popular, categories] = await Promise.all([
    sanityFetch<PostCard[]>(FEATURED_POSTS_QUERY, { limit: 3 }),
    sanityFetch<PostCard[]>(RECENT_POSTS_QUERY, { limit: 9 }),
    sanityFetch<PostCard[]>(POPULAR_POSTS_QUERY, { limit: 5 }),
    sanityFetch<CategoryWithCount[]>(CATEGORIES_QUERY),
  ]);

  // Choose hero + secondary featured, falling back to most recent posts.
  const featureSource = featured.length > 0 ? featured : recent;
  const hero = featureSource[0];
  const secondaryFeatured = featureSource.slice(1, 3);
  const heroIds = new Set(
    [hero, ...secondaryFeatured].filter(Boolean).map((p) => p._id),
  );

  const recentGrid = recent.filter((p) => !heroIds.has(p._id)).slice(0, 6);

  return (
    <main>
      {/* Intro */}
      <section className="border-b border-border bg-card/30">
        <div className="container mx-auto max-w-6xl px-4 py-10 sm:py-14">
          <p className="font-mono text-sm font-medium text-primary">
            $ cat syntax-stories
          </p>
          <h1 className="mt-3 max-w-3xl text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Stories, deep dives, and tutorials for people who build software.
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Practical writing on web development, engineering craft, and the
            tools that make great software.
          </p>
        </div>
      </section>

      <div className="container mx-auto max-w-6xl space-y-16 px-4 py-12">
        {/* Featured */}
        {hero && (
          <section aria-labelledby="featured-heading">
            <SectionHeading title="Featured" />
            <h2 id="featured-heading" className="sr-only">
              Featured posts
            </h2>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <BlogCard post={hero} variant="hero" priority />
              </div>
              {secondaryFeatured.length > 0 && (
                <div className="flex flex-col gap-6">
                  {secondaryFeatured.map((post) => (
                    <BlogCard
                      key={post._id}
                      post={post}
                      variant="default"
                      className="flex-1"
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Category filter */}
        {categories.length > 0 && (
          <section aria-label="Browse by category">
            <SectionHeading
              title="Browse by topic"
              description="Filter stories by category"
            />
            <CategoryPills categories={categories} />
          </section>
        )}

        {/* Recent + Popular */}
        <section aria-labelledby="recent-heading">
          <div className="grid gap-10 lg:grid-cols-3">
            {/* Recent */}
            <div className="lg:col-span-2">
              <SectionHeading
                title="Latest posts"
                description="Fresh from the editor"
              />
              <h2 id="recent-heading" className="sr-only">
                Latest posts
              </h2>
              {recentGrid.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2">
                  {recentGrid.map((post) => (
                    <BlogCard key={post._id} post={post} />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No posts yet.</p>
              )}
            </div>

            {/* Popular */}
            <aside className="lg:col-span-1">
              <div className="lg:sticky lg:top-24">
                <SectionHeading title="Popular" />
                {popular.length > 0 ? (
                  <div className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5">
                    {popular.map((post, i) => (
                      <div key={post._id} className="flex gap-4">
                        <span className="font-mono text-lg font-bold text-primary/60">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <BlogCard
                          post={post}
                          variant="compact"
                          className="flex-1"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
                    Mark posts as popular in the studio to populate this list.
                  </p>
                )}

                {categories.length > 0 && (
                  <div className="mt-8 rounded-xl border border-border bg-card p-5">
                    <h3 className="mb-3 text-sm font-semibold">All topics</h3>
                    <ul className="flex flex-col gap-2">
                      {categories.map((category) => (
                        <li key={category.slug}>
                          <Link
                            href={`/category/${category.slug}`}
                            className="flex items-center justify-between text-sm text-muted-foreground transition-colors hover:text-foreground"
                          >
                            <span>{category.title}</span>
                            <span className="text-xs text-muted-foreground/60">
                              {category.count}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
