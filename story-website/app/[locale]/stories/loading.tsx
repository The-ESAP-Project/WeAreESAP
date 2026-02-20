// Copyright 2021-2026 The ESAP Project
// SPDX-License-Identifier: Apache-2.0

export default function StoriesLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
      <div className="h-8 w-40 bg-muted rounded mb-8" />
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="border border-border rounded-xl p-6 flex gap-6"
          >
            <div className="w-24 h-32 bg-muted rounded-lg shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="h-6 w-48 bg-muted rounded" />
              <div className="h-4 w-full bg-muted rounded" />
              <div className="h-4 w-3/4 bg-muted rounded" />
              <div className="h-4 w-20 bg-muted rounded mt-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
