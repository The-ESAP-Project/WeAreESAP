// Copyright 2021-2026 The ESAP Project
// SPDX-License-Identifier: Apache-2.0

import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
      <p className="text-muted-foreground mb-8">{t("description")}</p>
      <Link href="/" className="text-esap-blue hover:underline">
        {t("backHome")}
      </Link>
    </div>
  );
}
