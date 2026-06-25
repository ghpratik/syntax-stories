import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "./components/theme-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://syntax-stories.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Syntax Stories — A Developer Blog",
    template: "%s · Syntax Stories",
  },
  description:
    "Deep dives, tutorials, and stories on software engineering, web development, and the craft of writing code.",
  keywords: [
    "programming",
    "web development",
    "software engineering",
    "javascript",
    "typescript",
    "react",
    "next.js",
    "developer blog",
  ],
  authors: [{ name: "Syntax Stories" }],
  creator: "Syntax Stories",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Syntax Stories",
    title: "Syntax Stories — A Developer Blog",
    description:
      "Deep dives, tutorials, and stories on software engineering and the craft of writing code.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Syntax Stories — A Developer Blog",
    description:
      "Deep dives, tutorials, and stories on software engineering and the craft of writing code.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0c1512" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "bg-background",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <body className="bg-background text-foreground min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
