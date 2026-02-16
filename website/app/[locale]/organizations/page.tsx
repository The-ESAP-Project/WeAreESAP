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

import { setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { loadJsonFiles } from "@/lib/data-loader";
import type { Organization } from "@/types/organization";

async function getOrganizations(locale: string): Promise<Organization[]> {
  return loadJsonFiles<Organization>(["data", "organizations"], locale, {
    sortByOrder: true,
  });
}

export default async function OrganizationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const organizations = await getOrganizations(locale);
  const firstOrg = organizations[0];

  if (firstOrg) {
    redirect({ href: `/organizations/${firstOrg.id}`, locale });
  }
}
