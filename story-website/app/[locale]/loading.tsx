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

export default function HomeLoading() {
  return (
    <div className="animate-pulse">
      {/* Hero skeleton */}
      <section className="flex items-center justify-center px-4 py-16 md:py-28">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="h-14 w-80 bg-muted rounded mx-auto" />
          <div className="h-6 w-96 bg-muted rounded mx-auto" />
          <div className="h-10 w-32 bg-muted rounded-lg mx-auto" />
        </div>
      </section>

      {/* Featured story skeleton */}
      <section className="max-w-5xl mx-auto px-4 pt-8 pb-8">
        <div className="h-7 w-40 bg-muted rounded mb-6" />
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="h-52 md:h-64 bg-muted" />
          <div className="p-6 space-y-3">
            <div className="flex gap-2">
              <div className="h-5 w-14 bg-muted rounded-full" />
              <div className="h-5 w-14 bg-muted rounded-full" />
            </div>
            <div className="h-6 w-56 bg-muted rounded" />
            <div className="h-4 w-full bg-muted rounded" />
            <div className="h-4 w-4/5 bg-muted rounded" />
            <div className="h-4 w-3/5 bg-muted rounded" />
            <div className="h-4 w-20 bg-muted rounded mt-4" />
          </div>
        </div>
      </section>

      {/* More stories skeleton */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="h-7 w-32 bg-muted rounded mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-border overflow-hidden"
            >
              <div className="h-40 md:h-48 bg-muted" />
              <div className="p-4 space-y-2">
                <div className="flex gap-2">
                  <div className="h-5 w-12 bg-muted rounded-full" />
                  <div className="h-5 w-12 bg-muted rounded-full" />
                </div>
                <div className="h-5 w-40 bg-muted rounded" />
                <div className="h-4 w-full bg-muted rounded" />
                <div className="h-4 w-3/4 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
