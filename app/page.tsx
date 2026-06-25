import { type SanityDocument } from "next-sanity";
import { client } from "@/sanity/lib/client";
import BlogCard from "./components/BlogCard";

const POSTS_QUERY = `*[
  _type == "post"
  && defined(slug.current)
] | order(publishedAt desc)[0...12]{
  _id,
  title,
  slug,
  mainImage,
  "categories": categories[]->{
    title,
    slug
  },
  "author": author->{
    name,
    image
  },
  publishedAt
}`;

const options = { next: { revalidate: 30 } };

export default async function IndexPage() {
  const posts = await client.fetch<SanityDocument[]>(POSTS_QUERY, {}, options);
  console.log("posts", posts);
  return (
    <main className="container mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-8 text-4xl font-bold">Latest Posts</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post._id} post={post} />
        ))}
      </div>
    </main>
  );
}
