// Copyright 2021-2026 The ESAP Project
// SPDX-License-Identifier: Apache-2.0

export default function StoryLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
      {/* Cover + title */}
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        <div className="w-full md:w-48 h-64 bg-muted rounded-xl shrink-0" />
        <div className="flex-1 space-y-4 pt-2">
          <div className="h-8 w-56 bg-muted rounded" />
          <div className="h-4 w-32 bg-muted rounded" />
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-5/6 bg-muted rounded" />
          <div className="h-4 w-4/6 bg-muted rounded" />
        </div>
      </div>
      {/* Chapter list */}
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-14 bg-muted rounded-lg" />
        ))}
      </div>
    </div>
  );
}
