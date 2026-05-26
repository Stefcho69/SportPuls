import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic-ext"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SportPuls",
  description: "Sports dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bg" className={inter.variable}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
