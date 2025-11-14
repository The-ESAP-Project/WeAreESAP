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
import { getMessages, getTranslations } from "next-intl/server";
import { locales } from "@/i18n/request";
import { SITE_CONFIG, DEFAULT_IMAGES } from "@/lib/constants";

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("common.metadata");
  const ogImage = DEFAULT_IMAGES.homepage;
  const title = `${t("title")} - ${t("subtitle")}`;
  const description = t("description");
  const keywords = t.raw("keywords") as string[];

  return {
    metadataBase: new URL(SITE_CONFIG.baseUrl),
    title,
    description,
    keywords,
    authors: [{ name: "AptS:1547" }, { name: "AptS:1548" }],
    openGraph: {
      title,
      description,
      type: "website",
      url: `/${locale}`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: SITE_CONFIG.siteName,
        },
      ],
      siteName: SITE_CONFIG.siteName,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: `/${locale}`,
    },
  };
}

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
