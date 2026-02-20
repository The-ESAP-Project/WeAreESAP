// Copyright 2021-2026 The ESAP Project
// SPDX-License-Identifier: Apache-2.0

"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function Navigation() {
  const t = useTranslations("common.navigation");
  const pathname = usePathname();

  const links = [
    { href: "/", label: t("home") },
    { href: "/stories", label: t("stories") },
  ] as const;

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <nav className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Link href="/" className="flex items-center gap-2 mr-4 group">
            <Image
              src="/favicon.ico"
              alt="ESAP Stories"
              width={28}
              height={28}
              priority
              className="opacity-90 group-hover:opacity-100 transition-opacity"
            />
            <span className="font-bold text-foreground group-hover:text-esap-blue transition-colors">
              ESAP Stories
            </span>
          </Link>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3 py-1.5 text-sm rounded-md transition-colors",
                pathname === link.href
                  ? "text-foreground bg-muted"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
