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

export default function StoriesLoading() {
  return (
    <div className="animate-pulse">
      {/* Hero skeleton */}
      <section className="py-16 px-4 text-center space-y-3">
        <div className="h-10 w-64 bg-muted rounded mx-auto" />
        <div className="h-6 w-80 bg-muted rounded mx-auto" />
      </section>

      {/* Stories skeleton */}
      <div className="max-w-5xl mx-auto px-4 pb-16 space-y-12">
        <section>
          <div className="mb-6 space-y-2">
            <div className="h-7 w-48 bg-muted rounded" />
            <div className="h-4 w-72 bg-muted rounded" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-border overflow-hidden flex flex-col"
              >
                <div className="h-40 md:h-48 bg-muted shrink-0" />
                <div className="p-5 space-y-2">
                  <div className="flex gap-2">
                    <div className="h-5 w-12 bg-muted rounded-full" />
                    <div className="h-5 w-12 bg-muted rounded-full" />
                  </div>
                  <div className="h-5 w-40 bg-muted rounded" />
                  <div className="h-4 w-full bg-muted rounded" />
                  <div className="h-4 w-3/4 bg-muted rounded" />
                  <div className="h-4 w-16 bg-muted rounded mt-3" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
