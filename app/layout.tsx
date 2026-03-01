import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Standup.so — AI-Powered Standup Reports",
  description: "Turn your git commits and task list into a polished daily standup report in seconds. Powered by AI.",
  openGraph: {
    title: "Standup.so — AI-Powered Standup Reports",
    description: "Turn your git commits and task list into a polished daily standup report in seconds.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>{children}<Analytics /></body>
    </html>
  );
}
