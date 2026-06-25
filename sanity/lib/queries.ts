import { groq } from "next-sanity";

// Shared projection for post cards
const POST_CARD_FIELDS = `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  mainImage,
  publishedAt,
  featured,
  "popularity": coalesce(popularity, 0),
  "categories": categories[]->{ title, "slug": slug.current },
  "author": author->{ name, image }
`;

// Newest posts (recent / latest)
export const RECENT_POSTS_QUERY = groq`*[
  _type == "post" && defined(slug.current)
] | order(publishedAt desc)[0...$limit]{
  ${POST_CARD_FIELDS}
}`;

// Featured posts (editor curated)
export const FEATURED_POSTS_QUERY = groq`*[
  _type == "post" && defined(slug.current) && featured == true
] | order(publishedAt desc)[0...$limit]{
  ${POST_CARD_FIELDS}
}`;

// Popular posts (ranked by popularity, then recency)
export const POPULAR_POSTS_QUERY = groq`*[
  _type == "post" && defined(slug.current) && coalesce(popularity, 0) > 0
] | order(popularity desc, publishedAt desc)[0...$limit]{
  ${POST_CARD_FIELDS}
}`;

// All posts (fallback grid)
export const ALL_POSTS_QUERY = groq`*[
  _type == "post" && defined(slug.current)
] | order(publishedAt desc){
  ${POST_CARD_FIELDS}
}`;

// Posts by category slug
export const POSTS_BY_CATEGORY_QUERY = groq`*[
  _type == "post" && defined(slug.current)
  && $slug in categories[]->slug.current
] | order(publishedAt desc){
  ${POST_CARD_FIELDS}
}`;

// Single post by slug
export const POST_QUERY = groq`*[
  _type == "post" && slug.current == $slug
][0]{
  ${POST_CARD_FIELDS},
  body
}`;

// Related posts sharing a category, excluding the current post
export const RELATED_POSTS_QUERY = groq`*[
  _type == "post" && defined(slug.current)
  && slug.current != $slug
  && count(categories[]->slug.current[@ in $categories]) > 0
] | order(publishedAt desc)[0...3]{
  ${POST_CARD_FIELDS}
}`;

// All categories with post counts
export const CATEGORIES_QUERY = groq`*[
  _type == "category" && defined(slug.current)
]{
  title,
  "slug": slug.current,
  description,
  "count": count(*[_type == "post" && references(^._id)])
} | order(count desc)`;

// Single category by slug
export const CATEGORY_QUERY = groq`*[
  _type == "category" && slug.current == $slug
][0]{
  title,
  "slug": slug.current,
  description
}`;

// Slugs for static generation
export const POST_SLUGS_QUERY = groq`*[
  _type == "post" && defined(slug.current)
].slug.current`;

export const CATEGORY_SLUGS_QUERY = groq`*[
  _type == "category" && defined(slug.current)
].slug.current`;
