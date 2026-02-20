// Copyright 2021-2026 The ESAP Project
// SPDX-License-Identifier: Apache-2.0

export default function HomeLoading() {
  return (
    <div className="animate-pulse">
      {/* Hero skeleton */}
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 gap-6">
        <div className="h-12 w-72 bg-muted rounded" />
        <div className="h-5 w-96 bg-muted rounded" />
        <div className="h-10 w-32 bg-muted rounded-full" />
      </div>
      {/* Featured story skeleton */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="border border-border rounded-xl p-8 flex gap-6">
          <div className="w-32 h-44 bg-muted rounded-lg shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-6 w-40 bg-muted rounded" />
            <div className="h-4 w-full bg-muted rounded" />
            <div className="h-4 w-3/4 bg-muted rounded" />
            <div className="h-9 w-28 bg-muted rounded mt-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
