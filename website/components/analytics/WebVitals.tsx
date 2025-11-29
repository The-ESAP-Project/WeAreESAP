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

import { useReportWebVitals } from "next/web-vitals";
import { logger } from "@/lib/logger";

/**
 * Web Vitals 性能监控组件
 *
 * 收集并报告以下性能指标：
 * - CLS (Cumulative Layout Shift): 累积布局偏移
 * - FID (First Input Delay): 首次输入延迟
 * - FCP (First Contentful Paint): 首次内容绘制
 * - LCP (Largest Contentful Paint): 最大内容绘制
 * - TTFB (Time to First Byte): 首字节时间
 * - INP (Interaction to Next Paint): 交互到下次绘制
 *
 * 开发环境：输出到控制台
 * 生产环境：可扩展到发送到分析服务
 */
export function WebVitals() {
  useReportWebVitals((metric) => {
    // 在开发环境输出到控制台
    if (process.env.NODE_ENV === "development") {
      logger.log(`📊 [Web Vitals] ${metric.name}:`, {
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id,
      });
    }

    // 在生产环境可以选择发送到分析服务
    // 例如：sendToAnalytics(metric)
    // 或者存储到 localStorage 用于本地分析
    if (process.env.NODE_ENV === "production") {
      // 存储到 localStorage（可选）
      try {
        const vitalsKey = "web-vitals";
        const stored = localStorage.getItem(vitalsKey);
        const vitals = stored ? JSON.parse(stored) : {};

        vitals[metric.name] = {
          value: metric.value,
          rating: metric.rating,
          timestamp: Date.now(),
        };

        localStorage.setItem(vitalsKey, JSON.stringify(vitals));
      } catch (error) {
        // localStorage 可能不可用，静默失败
      }
    }
  });

  // 这是一个无 UI 的组件，不渲染任何内容
  return null;
}
