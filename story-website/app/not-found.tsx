// Copyright 2021-2026 The ESAP Project
// SPDX-License-Identifier: Apache-2.0

import "@/app/globals.css";
import { getLocale } from "next-intl/server";

export default async function NotFound() {
  let locale = "zh-CN";
  try {
    locale = await getLocale();
  } catch {}

  const messages =
    locale === "en"
      ? (await import("@/messages/en/notFound.json")).default
      : (await import("@/messages/zh-CN/notFound.json")).default;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="bg-background text-foreground min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-muted-foreground mb-8">{messages.description}</p>
        <a href="/" className="text-esap-blue hover:underline">
          {messages.backHome}
        </a>
      </body>
    </html>
  );
}
