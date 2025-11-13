// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import {
  ThemeProvider,
  TransitionProvider,
  PageTransition,
  TransitionOverlay,
  Navigation,
  Footer,
  ScrollToTop,
  PanguProvider,
} from "@/components";
import { WebVitals } from "@/components/analytics";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { locales } from "@/i18n/request";
import { SITE_CONFIG } from "@/lib/constants";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "We Are ESAP - 向那卫星许愿",
  description:
    "The ESAP Project(逃离计划) - 一个科幻世界观创作企划,讲述仿生人与人类共存的未来故事",
  keywords: ["ESAP", "科幻", "仿生人", "世界观", "创作企划"],
  authors: [{ name: "AptS:1547" }, { name: "AptS:1548" }],
  openGraph: {
    title: "We Are ESAP",
    description: "向那卫星许愿 - The ESAP Project",
    type: "website",
    url: SITE_CONFIG.baseUrl,
  },
  alternates: {
    canonical: SITE_CONFIG.baseUrl,
  },
};

// 生成静态参数
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <TransitionProvider>
              <PanguProvider />
              <Navigation />
              <PageTransition>{children}</PageTransition>
              <Footer />
              <ScrollToTop />
              <TransitionOverlay />
            </TransitionProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
        <WebVitals />
      </body>
    </html>
  );
}
