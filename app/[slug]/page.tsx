import { PortableText, type SanityDocument } from "next-sanity";
import {
  createImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { components } from "../components/PortableTextComponents";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]{
  title,
  slug,
  publishedAt,
  body[],
  mainImage,
  "author": author->{
    name,
    image
  },
  "categories": categories[]->{
    title,
    slug
  }
}`;

const { projectId, dataset } = client.config();

const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? createImageUrlBuilder({ projectId, dataset }).image(source)
    : null;

const options = { next: { revalidate: 30 } };

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await client.fetch<SanityDocument>(
    POST_QUERY,
    { slug },
    options,
  );

  const postImageUrl = post.mainImage
    ? urlFor(post.mainImage)?.width(900).height(500).url()
    : null;

  const authorImageUrl = post.author?.image
    ? urlFor(post.author.image)?.width(80).height(80).url()
    : null;

  return (
    <main className="container mx-auto min-h-screen max-w-4xl p-8 flex flex-col gap-4">
      <Link href="/" className="hover:underline">
        ← Back to posts
      </Link>
      {post.categories && (
        <div className="flex gap-2 flex-wrap">
          {post.categories.map(
            (category: { title: string; slug: string }, idx: number) => (
              <Badge variant="secondary" key={idx}>
                {category.title}
              </Badge>
            ),
          )}
        </div>
      )}
      {postImageUrl && (
        <div className="w-full">
          <AspectRatio ratio={16 / 9} className="rounded-lg bg-muted">
            <Image
              src={postImageUrl}
              alt={post.title}
              fill
              className="w-full rounded-lg object-cover"
            />
          </AspectRatio>
        </div>
      )}

      <h1 className="text-4xl font-bold">{post.title}</h1>

      <div className="flex justify-between items-center text-sm text-muted-foreground">
        {/* Author */}
        <div className="flex items-center gap-3">
          {authorImageUrl && (
            <Avatar>
              <AvatarImage
                src={authorImageUrl}
                alt={post.author?.name}
                className=""
              />
              <AvatarFallback>{post.author?.name.charAt(0)}</AvatarFallback>
            </Avatar>
          )}
          <p>{post.author?.name}</p>
        </div>

        <span>
          Published:{" "}
          {new Date(post.publishedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>

      <div className="prose text-lg text-muted-foreground">
        {Array.isArray(post.body) && (
          <PortableText value={post.body} components={components} />
        )}
      </div>
    </main>
  );
}
