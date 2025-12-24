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

import { memo } from "react";
import { LoadingSpinner } from "./LoadingSpinner";

export const GraphSkeleton = memo(function GraphSkeleton() {
  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden border border-border bg-background/50 relative">
      {/* 模拟节点 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[280px] h-[280px]">
          {/* 中心节点 */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-muted animate-pulse" />

          {/* 周围节点 */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => {
            const radian = (angle * Math.PI) / 180;
            const x = Math.cos(radian) * 100;
            const y = Math.sin(radian) * 100;
            return (
              <div
                key={angle}
                className="absolute w-12 h-12 rounded-full bg-muted/60 animate-pulse"
                style={{
                  top: `calc(50% + ${y}px)`,
                  left: `calc(50% + ${x}px)`,
                  transform: "translate(-50%, -50%)",
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            );
          })}

          {/* 连接线 */}
          <svg className="absolute inset-0 w-full h-full">
            {[0, 60, 120, 180, 240, 300].map((angle) => {
              const radian = (angle * Math.PI) / 180;
              const x = Math.cos(radian) * 100 + 140;
              const y = Math.sin(radian) * 100 + 140;
              return (
                <line
                  key={angle}
                  x1="140"
                  y1="140"
                  x2={x}
                  y2={y}
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-muted-foreground/30"
                />
              );
            })}
          </svg>
        </div>
      </div>

      {/* 加载指示器 */}
      <div className="absolute inset-0 flex items-center justify-center bg-background/30">
        <LoadingSpinner size={48} />
      </div>
    </div>
  );
});
