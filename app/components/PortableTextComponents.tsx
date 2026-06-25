/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import { CodeBlock } from "./CodeBlock";

export const components = {
  types: {
    image: ({ value }: any) => {
      const src = value?.asset?.url;

      if (!src) return null;

      return (
        <div className="my-3 overflow-hidden rounded-xl border bg-muted">
          <Image
            src={src}
            alt={value?.alt || "image"}
            width={1000}
            height={600}
            className="w-full h-auto object-cover"
          />
        </div>
      );
    },

    code: ({
      value,
    }: {
      value: { code: string; language: string; filename: string };
    }) => (
      <CodeBlock
        code={value.code}
        language={value.language}
        filename={value.filename}
      />
    ),

    flowDiagram: ({ value }: any) => {
      return (
        <div className="my-3 rounded-lg border bg-card p-4 shadow-sm">
          <p className="mb-2 text-sm font-medium">{value?.title}</p>

          <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs">
            {JSON.stringify(value, null, 2)}
          </pre>
        </div>
      );
    },
  },

  block: {
    h1: ({ children }: any) => (
      <h1 className="mt-8 text-4xl text-foreground font-bold tracking-tight">
        {children}
      </h1>
    ),

    h2: ({ children }: any) => (
      <h2 className="mt-6 text-3xl text-foreground font-semibold tracking-tight">
        {children}
      </h2>
    ),

    h3: ({ children }: any) => (
      <h3 className="text-foreground text-3xl font-semibold tracking-tight">
        {children}
      </h3>
    ),

    normal: ({ children }: any) => (
      <p className="my-4 text-lg leading-7 tracking-wide">{children}</p>
    ),

    blockquote: ({ children }: any) => (
      <blockquote className="my-6 border-l-4 border-primary/40 pl-4 italic text-muted-foreground">
        {children}
      </blockquote>
    ),
  },

  marks: {
    strong: ({ children }: any) => (
      <strong className="font-semibold text-foreground/80">{children}</strong>
    ),

    em: ({ children }: any) => <em className="italic">{children}</em>,

    link: ({ value, children }: any) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noreferrer"
        className="text-primary underline underline-offset-4 hover:opacity-80"
      >
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="my-6 ml-6 list-disc space-y-2">{children}</ul>
    ),

    number: ({ children }: any) => (
      <ol className="my-6 ml-6 list-decimal space-y-2">{children}</ol>
    ),
  },

  listItem: {
    bullet: ({ children }: any) => (
      <li className="text-lg leading-7">{children}</li>
    ),

    number: ({ children }: any) => (
      <li className="text-lg leading-7">{children}</li>
    ),
  },
};
