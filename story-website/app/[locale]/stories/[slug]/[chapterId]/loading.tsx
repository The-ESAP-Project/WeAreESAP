// Copyright 2021-2026 The ESAP Project
// SPDX-License-Identifier: Apache-2.0

export default function ChapterLoading() {
  return (
    <div className="min-h-screen pb-24 animate-pulse">
      {/* Top bar skeleton */}
      <div className="sticky top-14 z-40 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="h-4 w-24 bg-muted rounded" />
          <div className="h-4 w-32 bg-muted rounded" />
        </div>
      </div>

      {/* Chapter header skeleton */}
      <div className="max-w-3xl mx-auto px-4 pt-8 pb-4 text-center space-y-3">
        <div className="h-8 w-48 bg-muted rounded mx-auto" />
        <div className="h-4 w-32 bg-muted rounded mx-auto" />
      </div>

      {/* Content skeleton */}
      <div className="reader-content px-4 space-y-4 pt-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="max-w-[65ch] mx-auto">
            <div
              className="h-4 bg-muted rounded"
              style={{ width: `${75 + (i % 3) * 10}%` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
