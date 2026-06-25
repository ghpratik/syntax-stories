import type { PortableTextBlock } from "next-sanity";
import type { SanityImageSource } from "@sanity/image-url";

export interface Category {
  title: string;
  slug: string;
  description?: string;
}

export interface Author {
  name: string;
  image?: SanityImageSource;
  bio?: string;
}

export interface PostCard {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  mainImage?: SanityImageSource & { alt?: string };
  categories?: Category[];
  author?: Author;
  publishedAt: string;
  featured?: boolean;
  popularity?: number;
}

export interface Post extends PostCard {
  body?: PortableTextBlock[];
}

export interface CategoryWithCount extends Category {
  count: number;
}
