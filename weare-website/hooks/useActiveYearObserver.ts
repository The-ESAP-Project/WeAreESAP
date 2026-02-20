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

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * 监测各年份 section 的可见性，返回当前滚动到的年份
 */
export function useActiveYearObserver(years: string[]): {
  activeYear: string;
  setYearRef: (year: string, el: HTMLDivElement | null) => void;
} {
  const [activeYear, setActiveYear] = useState(years[0] ?? "");
  const yearRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const setYearRef = useCallback((year: string, el: HTMLDivElement | null) => {
    if (el) {
      yearRefs.current.set(year, el);
    } else {
      yearRefs.current.delete(year);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || years.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // 找到当前可见比例最大的年份 section
        let maxRatio = 0;
        let visibleYear = "";

        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            const year = entry.target.getAttribute("data-year");
            if (year) visibleYear = year;
          }
        }

        if (visibleYear) {
          setActiveYear(visibleYear);
        }
      },
      {
        // 聚焦视口上半部分，让年份切换更自然
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0, 0.1, 0.3, 0.5, 0.7, 1],
      }
    );

    for (const el of yearRefs.current.values()) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, [years]);

  return { activeYear, setYearRef };
}
