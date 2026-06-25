import Image from "next/image";
import Link from "next/link";

import { urlFor } from "@/sanity/lib/image";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { PostCard as PostCardType } from "@/lib/types";

type Variant = "default" | "hero" | "horizontal" | "compact";

interface BlogCardProps {
  post: PostCardType;
  variant?: Variant;
  priority?: boolean;
  className?: string;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function BlogCard({
  post,
  variant = "default",
  priority = false,
  className,
}: BlogCardProps) {
  const href = `/${post.slug}`;
  const primaryCategory = post.categories?.[0];
  const date = post.publishedAt ? formatDate(post.publishedAt) : null;

  // ---- HERO ----------------------------------------------------------------
  if (variant === "hero") {
    const imageUrl = post.mainImage
      ? urlFor(post.mainImage).width(1200).height(800).fit("crop").url()
      : null;

    return (
      <article className={cn("group relative", className)}>
        <Link href={href} className="block">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-muted">
            {imageUrl && (
              <Image
                src={imageUrl}
                alt={post.mainImage?.alt || post.title}
                fill
                priority={priority}
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              {primaryCategory && (
                <Badge className="mb-3 bg-primary text-primary-foreground hover:bg-primary">
                  {primaryCategory.title}
                </Badge>
              )}
              <h2 className="text-balance text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
                {post.title}
              </h2>
              {post.excerpt && (
                <p className="mt-3 line-clamp-2 max-w-2xl text-pretty text-sm text-white/80 sm:text-base">
                  {post.excerpt}
                </p>
              )}
              <div className="mt-4 flex items-center gap-3 text-sm text-white/70">
                {post.author?.name && <span>{post.author.name}</span>}
                {post.author?.name && date && <span aria-hidden>·</span>}
                {date && <time dateTime={post.publishedAt}>{date}</time>}
              </div>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  // ---- COMPACT (popular list) ---------------------------------------------
  if (variant === "compact") {
    const imageUrl = post.mainImage
      ? urlFor(post.mainImage).width(160).height(160).fit("crop").url()
      : null;

    return (
      <article className={cn("group", className)}>
        <Link href={href} className="flex items-center gap-4">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
            {imageUrl && (
              <Image
                src={imageUrl}
                alt={post.mainImage?.alt || post.title}
                fill
                sizes="64px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="line-clamp-2 text-sm font-semibold leading-snug transition-colors group-hover:text-primary">
              {post.title}
            </h3>
            {date && (
              <time
                dateTime={post.publishedAt}
                className="mt-1 block text-xs text-muted-foreground"
              >
                {date}
              </time>
            )}
          </div>
        </Link>
      </article>
    );
  }

  // ---- HORIZONTAL ----------------------------------------------------------
  if (variant === "horizontal") {
    const imageUrl = post.mainImage
      ? urlFor(post.mainImage).width(640).height(480).fit("crop").url()
      : null;

    return (
      <article
        className={cn(
          "group overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/40 hover:shadow-md",
          className,
        )}
      >
        <Link href={href} className="flex flex-col sm:flex-row">
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted sm:aspect-square sm:w-48">
            {imageUrl && (
              <Image
                src={imageUrl}
                alt={post.mainImage?.alt || post.title}
                fill
                sizes="(max-width: 640px) 100vw, 12rem"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            )}
          </div>
          <div className="flex flex-1 flex-col p-5">
            {primaryCategory && (
              <Badge variant="secondary" className="mb-2 w-fit">
                {primaryCategory.title}
              </Badge>
            )}
            <h3 className="text-pretty text-lg font-semibold leading-snug transition-colors group-hover:text-primary">
              {post.title}
            </h3>
            {post.excerpt && (
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                {post.excerpt}
              </p>
            )}
            <div className="mt-auto flex items-center gap-3 pt-4 text-sm text-muted-foreground">
              {post.author?.name && <span>{post.author.name}</span>}
              {post.author?.name && date && <span aria-hidden>·</span>}
              {date && <time dateTime={post.publishedAt}>{date}</time>}
            </div>
          </div>
        </Link>
      </article>
    );
  }

  // ---- DEFAULT -------------------------------------------------------------
  const imageUrl = post.mainImage
    ? urlFor(post.mainImage).width(640).height(420).fit("crop").url()
    : null;

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg",
        className,
      )}
    >
      <Link href={href} className="flex h-full flex-col">
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={post.mainImage?.alt || post.title}
              fill
              priority={priority}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
        </div>
        <div className="flex flex-1 flex-col p-5">
          {primaryCategory && (
            <Badge variant="secondary" className="mb-2 w-fit">
              {primaryCategory.title}
            </Badge>
          )}
          <h3 className="text-pretty text-lg font-semibold leading-snug transition-colors group-hover:text-primary">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
              {post.excerpt}
            </p>
          )}
          <div className="mt-auto flex items-center gap-3 pt-4 text-sm text-muted-foreground">
            {post.author?.name && <span>{post.author.name}</span>}
            {post.author?.name && date && <span aria-hidden>·</span>}
            {date && <time dateTime={post.publishedAt}>{date}</time>}
          </div>
        </div>
      </Link>
    </article>
  );
}
