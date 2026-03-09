"use client";

import { useLocale, useTranslations } from "next-intl";
import { memo, useCallback, useState } from "react";
import { LanguageSwitcher, ThemeToggle } from "@/components/ui";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { ROUTES } from "@/lib/constants";

const LOCALE_NAMES: Record<string, string> = {
  "zh-CN": "简体中文",
  en: "English",
};

const LOCALES = ["zh-CN", "en"] as const;

const NAV_ITEMS = [
  { key: "home", href: ROUTES.home },
  { key: "about", href: ROUTES.about },
  { key: "products", href: ROUTES.products },
  { key: "contact", href: ROUTES.contact },
] as const;

export const Navigation = memo(function Navigation() {
  const t = useTranslations("common.navigation");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLocaleChange = useCallback(
    (newLocale: string) => {
      router.replace(pathname, { locale: newLocale });
    },
    [router, pathname]
  );

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-foreground hover:opacity-80"
        >
          ESAP
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? "bg-foreground/5 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
              }`}
            >
              {t(item.key)}
            </Link>
          ))}
        </div>

        {/* Desktop Controls */}
        <div className="hidden md:flex items-center gap-2">
          <LanguageSwitcher
            locales={LOCALES}
            localeNames={LOCALE_NAMES}
            currentLocale={locale}
            onLocaleChange={handleLocaleChange}
          />
          <ThemeToggle />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-muted"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menu"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {mobileMenuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="4" y1="8" x2="20" y2="8" />
                <line x1="4" y1="16" x2="20" y2="16" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 py-4 space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "bg-foreground/5 text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                }`}
              >
                {t(item.key)}
              </Link>
            ))}
            <div className="flex items-center gap-2 pt-3 px-4 border-t border-border mt-3">
              <LanguageSwitcher
                locales={LOCALES}
                localeNames={LOCALE_NAMES}
                currentLocale={locale}
                onLocaleChange={handleLocaleChange}
              />
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  );
});
