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
import { useCallback, useMemo, useState } from "react";
import { ScrollableTabs, type TabItem } from "@/components/ui/ScrollableTabs";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { Sponsor } from "@/types/sponsor";
import { ProjectTab } from "./ProjectTab";
import { SponsorTab } from "./SponsorTab";

interface AboutTab extends TabItem {
  id: string;
  name: string;
}

interface AboutClientProps {
  sponsors: Sponsor[];
}

export function AboutClient({ sponsors }: AboutClientProps) {
  const t = useTranslations("about");
  const shouldReduceMotion = useReducedMotion();
  const [activeTabId, setActiveTabId] = useState("project");

  const tabs = useMemo<AboutTab[]>(
    () => [
      { id: "project", name: t("tabs.project") },
      ...sponsors.map((s) => ({ id: s.id, name: s.name })),
    ],
    [sponsors, t]
  );

  const activeSponsor = useMemo(
    () => sponsors.find((s) => s.id === activeTabId),
    [sponsors, activeTabId]
  );

  const handleTabChange = useCallback((id: string) => {
    setActiveTabId(id);
  }, []);

  return (
    <main className="min-h-screen">
      <ScrollableTabs<AboutTab>
        items={tabs}
        activeId={activeTabId}
        onTabChange={handleTabChange}
        getItemName={(tab) => tab.name}
        getUnderlineStyle={() =>
          "bg-linear-to-r from-esap-yellow via-esap-pink to-esap-blue"
        }
        layoutId="about-tabs"
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTabId}
          initial={shouldReduceMotion ? false : { opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0, x: -20 }}
          transition={{ duration: shouldReduceMotion ? 0.01 : 0.3 }}
        >
          {activeTabId === "project" ? (
            <ProjectTab />
          ) : (
            activeSponsor && <SponsorTab sponsor={activeSponsor} />
          )}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
