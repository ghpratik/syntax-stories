import type { Metadata } from "next";
import { PortableText, type PortableTextBlock } from "next-sanity";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";

import { sanityFetch } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import {
  POST_QUERY,
  POST_SLUGS_QUERY,
  RELATED_POSTS_QUERY,
} from "@/sanity/lib/queries";
import type { Post, PostCard } from "@/lib/types";
import { components } from "@/app/components/PortableTextComponents";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import BlogCard from "@/app/components/BlogCard";
import { SectionHeading } from "@/app/components/SectionHeading";

export const revalidate = 60;
export const dynamicParams = true;

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://syntax-stories.vercel.app";

// SSG: pre-render every post at build time.
export async function generateStaticParams() {
  const slugs = await sanityFetch<string[]>(POST_SLUGS_QUERY, {}, false);
  return slugs.map((slug) => ({ slug }));
}

function getPlainText(blocks?: PortableTextBlock[]): string {
  if (!blocks) return "";
  return blocks
    .filter((b) => b._type === "block")
    .map((b) =>
      ((b as unknown as { children?: { text?: string }[] }).children ?? [])
        .map((child) => child.text ?? "")
        .join(""),
    )
    .join(" ");
}

function readingTime(blocks?: PortableTextBlock[]): number {
  const words = getPlainText(blocks).trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await sanityFetch<Post | null>(POST_QUERY, { slug });

  if (!post) {
    return { title: "Post not found" };
  }

  const description =
    post.excerpt || getPlainText(post.body).slice(0, 160) || post.title;

  const ogImage = post.mainImage
    ? urlFor(post.mainImage).width(1200).height(630).fit("crop").url()
    : undefined;

  return {
    title: post.title,
    description,
    alternates: { canonical: `/${slug}` },
    openGraph: {
      type: "article",
      url: `/${slug}`,
      title: post.title,
      description,
      publishedTime: post.publishedAt,
      authors: post.author?.name ? [post.author.name] : undefined,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await sanityFetch<Post | null>(POST_QUERY, { slug });

  if (!post) {
    notFound();
  }

  const categorySlugs = (post.categories ?? []).map((c) => c.slug);
  const related = await sanityFetch<PostCard[]>(RELATED_POSTS_QUERY, {
    slug,
    categories: categorySlugs,
  });

  const postImageUrl = post.mainImage
    ? urlFor(post.mainImage).width(1200).height(675).fit("crop").url()
    : null;

  const authorImageUrl = post.author?.image
    ? urlFor(post.author.image).width(80).height(80).fit("crop").url()
    : null;

  const minutes = readingTime(post.body);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || getPlainText(post.body).slice(0, 160),
    image: postImageUrl ? [postImageUrl] : undefined,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: post.author?.name
      ? { "@type": "Person", name: post.author.name }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: "Syntax Stories",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/${slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="container mx-auto max-w-3xl px-4 py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to posts
        </Link>

        <header className="mt-6">
          {post.categories && post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.categories.map((category) => (
                <Link key={category.slug} href={`/category/${category.slug}`}>
                  <Badge
                    variant="secondary"
                    className="transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    {category.title}
                  </Badge>
                </Link>
              ))}
            </div>
          )}

          <h1 className="mt-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
              {post.excerpt}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              {authorImageUrl ? (
                <Avatar className="h-9 w-9">
                  <AvatarImage src={authorImageUrl} alt={post.author?.name} />
                  <AvatarFallback>
                    {post.author?.name?.charAt(0) ?? "?"}
                  </AvatarFallback>
                </Avatar>
              ) : null}
              {post.author?.name && (
                <span className="font-medium text-foreground">
                  {post.author.name}
                </span>
              )}
            </div>
            <span aria-hidden>·</span>
            {post.publishedAt && (
              <time dateTime={post.publishedAt}>
                {formatDate(post.publishedAt)}
              </time>
            )}
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {minutes} min read
            </span>
          </div>
        </header>

        {postImageUrl && (
          <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-muted">
            <Image
              src={postImageUrl}
              alt={post.mainImage?.alt || post.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        )}

        <Separator className="my-8" />

        <div className="prose prose-lg max-w-none text-foreground">
          {Array.isArray(post.body) && (
            <PortableText value={post.body} components={components} />
          )}
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t border-border bg-card/30">
          <div className="container mx-auto max-w-6xl px-4 py-12">
            <SectionHeading title="Related reading" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <BlogCard key={p._id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
