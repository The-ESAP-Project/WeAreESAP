// Copyright 2021-2026 The ESAP Project
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { useReadingPreferences } from "@/hooks/useReadingPreferences";
import { cn } from "@/lib/utils";
import type { ReadingPreferences } from "@/types/reading-state";

export function ReaderToolbar() {
  const t = useTranslations("reader.toolbar");
  const { preferences, setPreferences } = useReadingPreferences();
  const [open, setOpen] = useState(false);

  const fontSizes: ReadingPreferences["fontSize"][] = [
    "sm",
    "base",
    "lg",
    "xl",
  ];

  const lineHeights: {
    value: ReadingPreferences["lineHeight"];
    label: string;
  }[] = [
    { value: "normal", label: "×1.6" },
    { value: "relaxed", label: "×1.8" },
    { value: "loose", label: "×2.0" },
  ];

  return (
    <>
      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 left-6 z-40 w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center hover:bg-muted/80 transition-colors"
        aria-label="Reading settings"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-18 left-6 z-40 w-64 bg-background border border-border rounded-xl shadow-lg p-4 space-y-4">
          {/* Font size */}
          <div>
            <span className="text-xs text-muted-foreground mb-1 block">
              {t("fontSize")}
            </span>
            <div className="flex gap-1">
              {fontSizes.map((size) => (
                <button
                  type="button"
                  key={size}
                  onClick={() => setPreferences({ fontSize: size })}
                  className={cn(
                    "flex-1 py-1 text-xs rounded",
                    preferences.fontSize === size
                      ? "bg-foreground text-background"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {size.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Font family */}
          <div>
            <span className="text-xs text-muted-foreground mb-1 block">
              {t("fontFamily")}
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setPreferences({ fontFamily: "serif" })}
                className={cn(
                  "flex-1 py-1 text-xs rounded",
                  preferences.fontFamily === "serif"
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {t("serif")}
              </button>
              <button
                type="button"
                onClick={() => setPreferences({ fontFamily: "sans" })}
                className={cn(
                  "flex-1 py-1 text-xs rounded",
                  preferences.fontFamily === "sans"
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {t("sans")}
              </button>
            </div>
          </div>

          {/* Line height */}
          <div>
            <span className="text-xs text-muted-foreground mb-1 block">
              {t("lineHeight")}
            </span>
            <div className="flex gap-1">
              {lineHeights.map(({ value, label }) => (
                <button
                  type="button"
                  key={value}
                  onClick={() => setPreferences({ lineHeight: value })}
                  className={cn(
                    "flex-1 py-1 text-xs rounded",
                    preferences.lineHeight === value
                      ? "bg-foreground text-background"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Atmosphere toggle */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {t("atmosphere")}
            </span>
            <button
              type="button"
              onClick={() =>
                setPreferences({
                  atmosphereEffects: !preferences.atmosphereEffects,
                })
              }
              className={cn(
                "w-10 h-5 rounded-full transition-colors relative",
                preferences.atmosphereEffects ? "bg-esap-blue" : "bg-muted"
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform",
                  preferences.atmosphereEffects ? "left-5" : "left-0.5"
                )}
              />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
