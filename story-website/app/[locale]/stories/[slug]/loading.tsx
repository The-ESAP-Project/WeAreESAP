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

export default function StoryLoading() {
  return (
    <div className="min-h-screen animate-pulse">
      {/* Top bar skeleton */}
      <div className="sticky top-14 z-40 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-2">
          <div className="h-4 w-24 bg-muted rounded" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8 space-y-3">
          <div className="flex gap-2">
            <div className="h-5 w-14 bg-muted rounded-full" />
            <div className="h-5 w-14 bg-muted rounded-full" />
          </div>
          <div className="h-9 w-64 bg-muted rounded" />
          <div className="h-5 w-48 bg-muted rounded" />
        </div>

        {/* Synopsis */}
        <div className="mb-8 space-y-3">
          <div className="h-5 w-20 bg-muted rounded" />
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-5/6 bg-muted rounded" />
          <div className="h-4 w-4/6 bg-muted rounded" />
        </div>

        {/* CTA button */}
        <div className="mb-10">
          <div className="h-11 w-36 bg-muted rounded-lg" />
        </div>

        {/* Chapter list */}
        <div>
          <div className="h-5 w-20 bg-muted rounded mb-4" />
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-11 bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
