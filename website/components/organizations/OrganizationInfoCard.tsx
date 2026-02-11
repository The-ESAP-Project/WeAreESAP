// Copyright 2025 The ESAP Project
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

import { useTranslations } from "next-intl";
import { memo } from "react";
import { Icon } from "@/components/ui";
import type { Organization } from "@/types/organization";

interface OrganizationInfoCardProps {
  organization: Organization;
}

export const OrganizationInfoCard = memo(function OrganizationInfoCard({
  organization,
}: OrganizationInfoCardProps) {
  const t = useTranslations("organizations");
  const { info, theme } = organization;

  const statusLabels: Record<string, string> = {
    active: t("info.statusActive"),
    dormant: t("info.statusDormant"),
    disbanded: t("info.statusDisbanded"),
  };

  const statusColors: Record<string, string> = {
    active: "bg-green-500/20 text-green-500 border-green-500/50",
    dormant: "bg-slate-500/20 text-slate-400 border-slate-500/50",
    disbanded: "bg-red-500/20 text-red-500 border-red-500/50",
  };

  return (
    <div
      className="rounded-xl border-2 p-6 mb-8"
      style={{ borderColor: `${theme.primary}50` }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {t("info.code")}
            </span>
            <span
              className="font-mono font-bold text-lg"
              style={{ color: theme.accent }}
            >
              {info.code}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {t("info.fullName")}
            </span>
            <span className="text-foreground">{info.fullName}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {t("info.affiliation")}
            </span>
            <span className="text-foreground">{info.affiliation}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {t("info.establishedTime")}
            </span>
            <span className="text-foreground">{info.establishedTime}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {t("info.status")}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusColors[info.status]}`}
            >
              {statusLabels[info.status]}
            </span>
          </div>
        </div>
      </div>

      {info.coreDirective && (
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Shield" size={20} color={theme.accent} />
            <span className="text-sm text-muted-foreground">
              {t("info.coreDirective")}
            </span>
          </div>
          <p className="text-2xl font-bold" style={{ color: theme.accent }}>
            {info.coreDirective}
          </p>
        </div>
      )}
    </div>
  );
});
