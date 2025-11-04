// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["zh-CN", "en", "ja"],
  defaultLocale: "zh-CN",
  localePrefix: "as-needed",
});
