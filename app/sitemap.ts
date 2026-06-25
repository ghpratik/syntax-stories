import type { MetadataRoute } from "next";

import { sanityFetch } from "@/sanity/lib/client";
import { CATEGORY_SLUGS_QUERY } from "@/sanity/lib/queries";
import { groq } from "next-sanity";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://syntax-stories.vercel.app";

const POSTS_SITEMAP_QUERY = groq`*[
  _type == "post" && defined(slug.current)
]{ "slug": slug.current, "updatedAt": coalesce(_updatedAt, publishedAt) }`;

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categorySlugs] = await Promise.all([
    sanityFetch<{ slug: string; updatedAt: string }[]>(
      POSTS_SITEMAP_QUERY,
      {},
      false,
    ),
    sanityFetch<string[]>(CATEGORY_SLUGS_QUERY, {}, false),
  ]);

  const postUrls: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/${post.slug}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const categoryUrls: MetadataRoute.Sitemap = categorySlugs.map((slug) => ({
    url: `${siteUrl}/category/${slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...postUrls,
    ...categoryUrls,
  ];
}
