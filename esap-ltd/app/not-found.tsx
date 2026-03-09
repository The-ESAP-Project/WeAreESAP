import { Geist } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const messages: Record<
  string,
  { heading: string; description: string; backHome: string }
> = {
  "zh-CN": {
    heading: "页面未找到",
    description: "你要找的页面不存在或已被移除。",
    backHome: "返回首页",
  },
  en: {
    heading: "Page Not Found",
    description:
      "The page you're looking for doesn't exist or has been removed.",
    backHome: "Back to Home",
  },
};

export default function NotFound() {
  const locale =
    typeof document !== "undefined"
      ? (document.cookie
          .split("; ")
          .find((c) => c.startsWith("NEXT_LOCALE="))
          ?.split("=")[1] ?? "zh-CN")
      : "zh-CN";

  const t = messages[locale] ?? messages["zh-CN"];

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} antialiased bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100`}
        style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
      >
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-8xl font-bold bg-gradient-to-r from-[#ffd93d] via-[#ff69b4] to-[#4da6ff] bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="mt-4 text-xl font-semibold">{t.heading}</h2>
          <p className="mt-2 text-neutral-500 dark:text-neutral-400">
            {t.description}
          </p>
          <a
            href="/"
            className="mt-8 px-6 py-3 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            {t.backHome}
          </a>
        </div>
      </body>
    </html>
  );
}
