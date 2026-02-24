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

export default function AboutLoading() {
  return (
    <div className="min-h-screen animate-pulse">
      {/* Tabs skeleton */}
      <div className="flex gap-4 px-4 sm:px-6 lg:px-8 pt-4 pb-2 max-w-4xl mx-auto">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-8 w-20 bg-muted rounded" />
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Title / subtitle / description */}
        <div className="text-center space-y-4">
          <div className="h-9 w-64 bg-muted rounded mx-auto" />
          <div className="h-6 w-48 bg-muted rounded mx-auto" />
          <div className="h-4 w-full max-w-2xl bg-muted rounded mx-auto" />
          <div className="h-4 w-4/5 max-w-2xl bg-muted rounded mx-auto" />
          <div className="w-24 h-1 bg-muted rounded-full mx-auto" />
        </div>

        {/* Links grid */}
        <div>
          <div className="h-6 w-32 bg-muted rounded mb-6" />
          <div className="grid gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="p-5 rounded-xl border border-border space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 bg-muted rounded" />
                  <div className="h-5 w-24 bg-muted rounded" />
                </div>
                <div className="h-4 w-full bg-muted rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div>
          <div className="h-6 w-24 bg-muted rounded mb-4" />
          <div className="p-5 rounded-xl border border-border">
            <div className="h-4 w-full bg-muted rounded" />
            <div className="h-4 w-3/4 bg-muted rounded mt-2" />
          </div>
        </div>

        {/* License */}
        <div>
          <div className="h-6 w-32 bg-muted rounded mb-4" />
          <div className="p-5 rounded-xl border border-border space-y-2">
            <div className="h-4 w-full bg-muted rounded" />
            <div className="h-4 w-5/6 bg-muted rounded" />
          </div>
        </div>

        {/* Notice (collapsed) */}
        <div className="flex items-center gap-2">
          <div className="h-6 w-28 bg-muted rounded" />
          <div className="h-5 w-5 bg-muted rounded" />
          <div className="h-4 w-20 bg-muted rounded" />
        </div>
      </div>
    </div>
  );
}
