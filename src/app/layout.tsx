import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "GBC Analytics Dashboard",
  description: "Real-time analytics dashboard for orders data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${inter.variable} dark h-full antialiased`}>
      <body className="min-h-full flex flex-col overflow-x-hidden relative">{children}</body>
    </html>
  );
}
