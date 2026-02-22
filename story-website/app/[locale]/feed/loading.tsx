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

export default function FeedLoading() {
  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-12 animate-pulse">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-7 h-7 bg-muted rounded" />
            <div className="h-8 w-48 bg-muted rounded" />
          </div>
          <div className="h-4 w-80 bg-muted rounded" />
        </div>

        {/* Feed URL */}
        <div className="mb-6">
          <div className="h-4 w-24 bg-muted rounded mb-3" />
          <div className="flex items-center gap-2 p-3 rounded-lg border border-border">
            <div className="flex-1 h-4 bg-muted rounded" />
            <div className="h-6 w-16 bg-muted rounded shrink-0" />
          </div>
        </div>

        {/* Other languages */}
        <div className="mb-10">
          <div className="h-4 w-32 bg-muted rounded mb-3" />
          <div className="space-y-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-lg border border-border"
              >
                <div className="h-4 w-20 bg-muted rounded shrink-0" />
                <div className="flex-1 h-3 bg-muted rounded" />
                <div className="h-6 w-16 bg-muted rounded shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Recent updates */}
        <div>
          <div className="h-6 w-36 bg-muted rounded mb-4" />
          <div className="space-y-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-3 rounded-lg"
              >
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="h-4 w-40 bg-muted rounded" />
                  <div className="h-3 w-64 bg-muted rounded" />
                </div>
                <div className="h-3 w-16 bg-muted rounded shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
