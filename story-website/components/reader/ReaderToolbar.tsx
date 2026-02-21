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

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { useReadingPreferences } from "@/hooks/useReadingPreferences";
import { useScrollVisible } from "@/hooks/useScrollVisible";
import { cn } from "@/lib/utils";
import type { ReadingPreferences } from "@/types/reading-state";

export function ReaderToolbar() {
  const t = useTranslations("reader.toolbar");
  const { preferences, setPreferences } = useReadingPreferences();
  const [open, setOpen] = useState(false);
  const scrollVisible = useScrollVisible(300);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        buttonRef.current?.contains(e.target as Node) ||
        panelRef.current?.contains(e.target as Node)
      )
        return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

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
      <motion.button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(!open)}
        animate={{ bottom: scrollVisible ? 80 : 24 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        style={{ right: 24 }}
        className="fixed z-40 w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center hover:bg-muted/80 transition-colors"
        aria-label="Reading settings"
      >
        <Icon name="Settings" size={16} />
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              bottom: scrollVisible ? 128 : 72,
            }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{ right: 24 }}
            className="fixed z-40 w-64 bg-background border border-border rounded-xl shadow-lg p-4 space-y-4"
          >
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
