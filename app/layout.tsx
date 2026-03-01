import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Standup.so — AI Standup Report Generator | Free",
  description: "Paste your git commits or task list and get a polished daily standup report in 10 seconds. Yesterday, Today, Blockers — ready to share. Free, no sign-up required.",
  keywords: ["standup report generator", "daily standup AI", "git commits to standup", "standup report tool", "scrum standup generator", "developer standup", "standup automation"],
  authors: [{ name: "Standup.so" }],
  openGraph: {
    title: "Standup.so — Write Your Daily Standup in 10 Seconds",
    description: "Paste your git commits or task list. Get a polished Yesterday / Today / Blockers report instantly. Free, no sign-up required.",
    type: "website",
    url: "https://standup-so.vercel.app",
    siteName: "Standup.so",
  },
  twitter: {
    card: "summary_large_image",
    title: "Standup.so — AI Standup Report Generator",
    description: "Paste commits → get standup report in 10 seconds. Free, no sign-up.",
    creator: "@cleoships",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://standup-so.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        {children}
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Standup.so",
              description: "AI-powered daily standup report generator for developers",
              url: "https://standup-so.vercel.app",
              applicationCategory: "DeveloperApplication",
              offers: [
                {
                  "@type": "Offer",
                  price: "0",
                  priceCurrency: "USD",
                  description: "Free plan — 5 reports per day",
                },
                {
                  "@type": "Offer",
                  price: "6",
                  priceCurrency: "USD",
                  description: "Pro plan — unlimited reports",
                },
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
