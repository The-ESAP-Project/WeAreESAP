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

import { useEffect, useCallback } from "react";
import { pangu } from "pangu/browser";

// 全局标志位，确保 autoSpacingPage 只启动一次
let autoSpacingStarted = false;

/**
 * 自动为页面中的中英文、数字之间添加空格
 * 使用 MutationObserver 监听 DOM 变化，实时格式化
 *
 * 性能优化方案：
 * 1. 使用 requestIdleCallback 在浏览器空闲时格式化
 * 2. 避免阻塞首屏渲染
 * 3. 全局 MutationObserver 只启动一次，避免重复监听
 *
 * 因為愛情跟書寫都需要適時地留白。
 */
export function usePangu() {
  // 使用 requestIdleCallback 在浏览器空闲时执行回调，避免阻塞渲染
  const scheduleFormat = useCallback((callback: () => void) => {
    if (typeof window === "undefined") return;

    if ("requestIdleCallback" in window) {
      requestIdleCallback(callback, { timeout: 2000 });
    } else {
      setTimeout(callback, 100);
    }
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;

    // 初始格式化：在浏览器空闲时执行
    scheduleFormat(() => {
      pangu.spacingNode(document.body);
    });

    // 启动自动监听（只启动一次，避免多个 MutationObserver）
    // pangu.autoSpacingPage() 内部已经做了防抖，不需要额外处理
    if (!autoSpacingStarted) {
      scheduleFormat(() => {
        pangu.autoSpacingPage();
        autoSpacingStarted = true;
      });
    }

    // 注意：pangu.autoSpacingPage() 会启动一个全局的 MutationObserver
    // 在 SPA 应用中只需要启动一次，之后会自动处理所有 DOM 变化
  }, [scheduleFormat]);
}
