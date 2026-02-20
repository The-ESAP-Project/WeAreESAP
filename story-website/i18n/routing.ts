// Copyright 2021-2026 The ESAP Project
// SPDX-License-Identifier: Apache-2.0

import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["zh-CN", "en"],
  defaultLocale: "zh-CN",
  localePrefix: "as-needed",
});
