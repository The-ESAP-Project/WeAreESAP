// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider, Navigation, Footer, ScrollToTop } from "@/components";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "We Are ESAP - 向那卫星许愿",
  description: "The ESAP Project（逃离计划）- 一个科幻世界观创作企划，讲述仿生人与人类共存的未来故事",
  keywords: ["ESAP", "科幻", "仿生人", "世界观", "创作企划"],
  authors: [{ name: "AptS:1547" }, { name: "AptS:1548" }],
  openGraph: {
    title: "We Are ESAP",
    description: "向那卫星许愿 - The ESAP Project",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <Navigation />
          {children}
          <Footer />
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
