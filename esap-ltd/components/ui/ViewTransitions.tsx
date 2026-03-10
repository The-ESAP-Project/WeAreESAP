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

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export function ViewTransitions() {
  const pathname = usePathname();
  const router = useRouter();
  const isNavigatingRef = useRef(false);

  useEffect(() => {
    // 检查浏览器是否支持 View Transitions API
    if (
      typeof document === "undefined" ||
      !("startViewTransition" in document)
    ) {
      return;
    }

    // 拦截所有链接点击
    const handleClick = (e: MouseEvent) => {
      if (isNavigatingRef.current) return;

      const target = e.target as HTMLElement;
      const link = target.closest("a");

      // 只处理内部链接
      if (
        !link ||
        link.target === "_blank" ||
        link.origin !== window.location.origin ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey ||
        link.hasAttribute("download")
      ) {
        return;
      }

      const href = link.getAttribute("href");
      if (!href || href === pathname) return;

      e.preventDefault();
      isNavigatingRef.current = true;

      // 使用 View Transitions API + Next.js router
      (
        document as Document & {
          startViewTransition?: (callback: () => void) => void;
        }
      ).startViewTransition?.(() => {
        router.push(href);
        // 导航完成后重置标志
        setTimeout(() => {
          isNavigatingRef.current = false;
        }, 100);
      });
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [pathname, router]);

  return null;
}
