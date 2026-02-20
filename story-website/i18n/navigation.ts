// Copyright 2021-2026 The ESAP Project
// SPDX-License-Identifier: Apache-2.0

import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
