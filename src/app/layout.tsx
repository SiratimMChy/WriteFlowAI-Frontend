import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-heading" });

export const metadata: Metadata = {
  title: "WriteFlow AI – Create Content That Converts",
  description: "The all-in-one AI platform for content creators, marketers, and businesses. Generate, rewrite, and optimize content 10x faster.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable, outfit.variable)} suppressHydrationWarning>
      <body className={cn(inter.variable, outfit.variable, "antialiased")}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
