// Copyright 2021-2026 The ESAP Project
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import "@/app/globals.css";
import { getLocale } from "next-intl/server";

const supportedLocales = ["zh-CN", "en", "ja"] as const;
type SupportedLocale = (typeof supportedLocales)[number];

export default async function NotFound() {
  let locale: SupportedLocale = "zh-CN";
  try {
    const detected = await getLocale();
    if (supportedLocales.includes(detected as SupportedLocale)) {
      locale = detected as SupportedLocale;
    }
  } catch {}

  const messages = (await import(`@/messages/${locale}/notFound.json`)).default;
  const homePath = locale === "zh-CN" ? "/" : `/${locale}`;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="bg-background text-foreground min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-muted-foreground mb-8">{messages.description}</p>
        <a href={homePath} className="text-esap-blue hover:underline">
          {messages.backHome}
        </a>
      </body>
    </html>
  );
}
