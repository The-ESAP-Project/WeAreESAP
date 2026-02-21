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

export default function CharactersLoading() {
  return (
    <div className="animate-pulse">
      {/* Hero skeleton */}
      <section className="py-16 px-4 text-center space-y-4">
        <div className="h-10 w-56 bg-muted rounded mx-auto" />
        <div className="h-6 w-80 bg-muted rounded mx-auto" />
        <div className="w-24 h-1 bg-muted rounded-full mx-auto" />
      </section>

      {/* Character card list skeleton */}
      <section className="max-w-3xl mx-auto px-4 pb-16">
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center rounded-lg border border-border overflow-hidden"
            >
              {/* Color accent bar */}
              <div className="w-1 self-stretch bg-muted shrink-0" />
              {/* Content */}
              <div className="flex-1 min-w-0 px-4 py-3 space-y-1.5">
                <div className="h-3 w-20 bg-muted rounded" />
                <div className="flex items-baseline gap-2">
                  <div className="h-4 w-24 bg-muted rounded" />
                  <div className="h-3 w-16 bg-muted rounded" />
                </div>
                <div className="h-3 w-4/5 bg-muted rounded" />
              </div>
              {/* Arrow */}
              <div className="pr-4 shrink-0">
                <div className="h-4 w-4 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
