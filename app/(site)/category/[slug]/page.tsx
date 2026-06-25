import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { sanityFetch } from "@/sanity/lib/client";
import {
  CATEGORIES_QUERY,
  CATEGORY_QUERY,
  CATEGORY_SLUGS_QUERY,
  POSTS_BY_CATEGORY_QUERY,
} from "@/sanity/lib/queries";
import type { Category, CategoryWithCount, PostCard } from "@/lib/types";
import BlogCard from "@/app/components/BlogCard";
import { CategoryPills } from "@/app/components/CategoryPills";

export const revalidate = 60;
export const dynamicParams = true;

// SSG: pre-render a page for every category at build time.
export async function generateStaticParams() {
  const slugs = await sanityFetch<string[]>(CATEGORY_SLUGS_QUERY, {}, false);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await sanityFetch<Category | null>(CATEGORY_QUERY, { slug });

  if (!category) {
    return { title: "Category not found" };
  }

  const title = `${category.title} articles`;
  const description =
    category.description ||
    `Browse all articles filed under ${category.title} on Syntax Stories.`;

  return {
    title,
    description,
    alternates: { canonical: `/category/${slug}` },
    openGraph: {
      title,
      description,
      type: "website",
      url: `/category/${slug}`,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [category, posts, categories] = await Promise.all([
    sanityFetch<Category | null>(CATEGORY_QUERY, { slug }),
    sanityFetch<PostCard[]>(POSTS_BY_CATEGORY_QUERY, { slug }),
    sanityFetch<CategoryWithCount[]>(CATEGORIES_QUERY),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <main>
      <section className="border-b border-border bg-card/30">
        <div className="container mx-auto max-w-6xl px-4 py-10 sm:py-14">
          <p className="font-mono text-sm font-medium text-primary">
            $ grep -r &quot;{category.title}&quot;
          </p>
          <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            {category.title}
          </h1>
          {category.description && (
            <p className="mt-3 max-w-2xl text-pretty text-muted-foreground">
              {category.description}
            </p>
          )}
          <p className="mt-2 text-sm text-muted-foreground">
            {posts.length} {posts.length === 1 ? "article" : "articles"}
          </p>
        </div>
      </section>

      <div className="container mx-auto max-w-6xl space-y-10 px-4 py-12">
        {categories.length > 0 && (
          <CategoryPills categories={categories} activeSlug={slug} />
        )}

        {posts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <BlogCard key={post._id} post={post} priority={i < 3} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            No articles in this category yet.
          </p>
        )}
      </div>
    </main>
  );
}
