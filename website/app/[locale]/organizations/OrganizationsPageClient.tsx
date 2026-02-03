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

import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Organization } from "@/types/organization";
import { ScrollableTabs } from "@/components/content";
import { OrganizationView } from "@/components/organizations";

interface OrganizationsPageClientProps {
  organizations: Organization[];
}

export function OrganizationsPageClient({
  organizations,
}: OrganizationsPageClientProps) {
  const searchParams = useSearchParams();

  const orgFromUrl = searchParams.get("org");
  const initialOrg =
    orgFromUrl && organizations.some((o) => o.id === orgFromUrl)
      ? orgFromUrl
      : organizations[0]?.id || "";

  const [activeOrgId, setActiveOrgId] = useState(initialOrg);

  const activeOrg = useMemo(
    () => organizations.find((o) => o.id === activeOrgId),
    [organizations, activeOrgId]
  );

  const handleTabChange = useCallback((orgId: string) => {
    setActiveOrgId(orgId);
    const newUrl = `${window.location.pathname}?org=${orgId}`;
    window.history.replaceState(null, "", newUrl);
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const element = document.querySelector(hash);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        });
      });
    }
  }, [activeOrgId]);

  return (
    <div className="min-h-screen">
      <ScrollableTabs
        items={organizations}
        activeId={activeOrgId}
        onTabChange={handleTabChange}
        getItemName={(o) => o.info.name}
        getItemIcon={(o) => o.icon}
        getItemIconColor={(o) => o.theme.accent}
        getUnderlineStyle={(o) => ({
          background: `linear-gradient(90deg, ${o.theme.primary}, ${o.theme.accent})`,
        })}
        layoutId="activeOrgTab"
      />

      {activeOrg && <OrganizationView organization={activeOrg} />}
    </div>
  );
}
