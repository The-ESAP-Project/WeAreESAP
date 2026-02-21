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

      {/* Bottom navigation skeleton */}
      <div className="max-w-3xl mx-auto px-4 pt-12 pb-8">
        <div className="flex justify-between items-center border-t border-border pt-6">
          <div className="h-4 w-20 bg-muted rounded" />
          <div className="h-4 w-20 bg-muted rounded" />
        </div>
      </div>
    </div>
  );
}
