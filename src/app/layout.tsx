import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageTransition } from "@/components/PageTransition";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://connorgorman.ca"),
  title: {
    default: "Connor Gorman",
    template: "%s — Connor Gorman",
  },
  description:
    "AI Engineer building intelligent systems at the intersection of ML and product.",
  openGraph: {
    title: "Connor Gorman",
    description:
      "AI Engineer building intelligent systems at the intersection of ML and product.",
    url: "https://connorgorman.ca",
    siteName: "Connor Gorman",
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Connor Gorman",
    description:
      "AI Engineer building intelligent systems at the intersection of ML and product.",
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Connor Gorman",
  url: "https://connorgorman.ca",
  jobTitle: "AI Engineer",
  description:
    "AI Engineer building intelligent systems at the intersection of ML and product.",
  sameAs: [
    "https://www.linkedin.com/in/connor-gorman7",
    "https://github.com/ConnorGorman7",
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
      className={`${geistSans.variable} ${geistMono.variable} dark h-full scroll-smooth antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-bg-elevated focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-green focus:outline-none focus:ring-2 focus:ring-green"
        >
          Skip to content
        </a>
        <Nav />
        <div id="main-content" className="flex flex-1 flex-col">
          <PageTransition>{children}</PageTransition>
        </div>
        <Footer />
      </body>
    </html>
  );
}
