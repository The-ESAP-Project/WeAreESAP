// Copyright 2021-2026 The ESAP Project
// SPDX-License-Identifier: Apache-2.0

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { BlockRenderer } from "@/components/reader/BlockRenderer";
import { useReadingState } from "@/hooks/useReadingState";
import type { StoryUnlockGateBlock } from "@/types/chapter";

interface UnlockGateProps {
  data: StoryUnlockGateBlock;
  storySlug: string;
}

export function UnlockGate({ data, storySlug }: UnlockGateProps) {
  const t = useTranslations("reader.unlock");
  const { storyState } = useReadingState(storySlug);

  const unlocked = storyState.unlockedContent.includes(data.targetId);

  return (
    <div className="my-6">
      <AnimatePresence mode="wait">
        {unlocked ? (
          <motion.div
            key="unlocked"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {data.unlockedContent.map((block, i) => (
              <BlockRenderer
                key={`unlocked-${block.type}-${i}`}
                block={block}
                storySlug={storySlug}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="locked"
            className="p-6 rounded-lg border border-dashed border-border bg-muted/30 text-center"
          >
            <p className="text-sm text-muted-foreground">{t("locked")}</p>
            <p className="text-xs text-muted-foreground mt-1 italic">
              {data.hint}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
