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

interface CharacterSkeletonProps {
  type?: "hero" | "info" | "section";
}

export const CharacterSkeleton = memo(function CharacterSkeleton({
  type = "section",
}: CharacterSkeletonProps) {
  if (type === "hero") {
    return (
      <div className="w-full h-[60vh] relative animate-pulse">
        <div className="absolute inset-0 bg-muted" />
        <div className="absolute bottom-8 left-8 space-y-4">
          <div className="h-8 w-24 bg-muted-foreground/20 rounded" />
          <div className="h-12 w-64 bg-muted-foreground/20 rounded" />
          <div className="h-6 w-48 bg-muted-foreground/20 rounded" />
        </div>
      </div>
    );
  }

  if (type === "info") {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-4 bg-muted rounded-xl">
            <div className="h-4 w-16 bg-muted-foreground/20 rounded mb-2" />
            <div className="h-6 w-24 bg-muted-foreground/20 rounded" />
          </div>
        ))}
      </div>
    );
  }

  // section 类型 - 默认
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-1 h-8 bg-muted-foreground/20 rounded" />
        <div className="h-8 w-32 bg-muted-foreground/20 rounded" />
      </div>
      <div className="space-y-3">
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-5/6 bg-muted rounded" />
        <div className="h-4 w-4/6 bg-muted rounded" />
      </div>
    </div>
  );
});
