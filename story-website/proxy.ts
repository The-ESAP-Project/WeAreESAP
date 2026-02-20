// Copyright 2021-2026 The ESAP Project
// SPDX-License-Identifier: Apache-2.0

import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // 匹配所有路径，除了以下这些：
  // - api 路由
  // - _next (Next.js 内部文件)
  // - _vercel (Vercel 内部文件)
  // - 静态文件 (图片、字体等)
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
