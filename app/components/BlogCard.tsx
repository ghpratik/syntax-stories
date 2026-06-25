import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { client } from "@/sanity/lib/client";
import { createImageUrlBuilder, SanityImageSource } from "@sanity/image-url";
import { SanityDocument } from "next-sanity";
import Image from "next/image";
import Link from "next/link";

interface BlogCardProps {
  post: SanityDocument;
}

const { projectId, dataset } = client.config();

const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? createImageUrlBuilder({ projectId, dataset }).image(source)
    : null;

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  const postImageUrl = post.mainImage
    ? urlFor(post.mainImage)?.width(450).height(250).url()
    : null;
  console.log("categories", post.categories); // Log the categories for debugging
  return (
    <Link key={post._id} href={`/${post.slug.current}`}>
      <Card className="h-full transition-all hover:-translate-y-1 hover:shadow-lg">
        {postImageUrl && (
          <AspectRatio ratio={16 / 9} className="rounded-t-lg bg-muted">
            <Image
              src={postImageUrl}
              alt={post.title}
              className="w-full h-full object-fill"
              width={450}
              height={250}
            />
          </AspectRatio>
        )}
        <CardHeader>
          <CardTitle className="line-clamp-2">{post.title}</CardTitle>
        </CardHeader>

        <CardContent>
          {post.categories && (
            <CardDescription className="flex gap-1 flex-wrap mb-2">
              {post.categories.map(
                (category: { title: string; slug: string }, idx: number) => (
                  <Badge variant="secondary" key={idx}>
                    {category.title}
                  </Badge>
                ),
              )}
            </CardDescription>
          )}
          <p className="text-sm text-muted-foreground">
            {new Date(post.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default BlogCard;
