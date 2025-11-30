import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ResearchSentinel - AI-Powered Research Integrity Auditor",
  description: "Automatically audit research papers for citation accuracy, methodology quality, reproducibility, and AI-generated content. Get professional audit reports in minutes.",
  keywords: ["research", "audit", "AI", "academic integrity", "citation validation", "plagiarism detection"],
  authors: [{ name: "ResearchSentinel Team" }],
  openGraph: {
    title: "ResearchSentinel - AI-Powered Research Integrity Auditor",
    description: "Ensure research integrity with AI-powered auditing",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
        <Toaster
          position="top-right"
          richColors
          closeButton
          duration={4000}
        />
      </body>
    </html>
  );
}
