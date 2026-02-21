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

export default function CharacterDetailLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-pulse">
      {/* 1. Quote block skeleton */}
      <div className="rounded-lg py-12 md:py-16 px-6 md:px-10 mb-10 bg-muted/30">
        <div className="h-3 w-24 bg-muted rounded mb-6" />
        <div className="space-y-3 mb-6">
          <div className="h-7 w-full bg-muted rounded" />
          <div className="h-7 w-5/6 bg-muted rounded" />
        </div>
        <div className="h-4 w-36 bg-muted rounded" />
      </div>

      {/* 2. Archive info grid skeleton */}
      <div className="mb-10">
        <div className="h-5 w-20 bg-muted rounded mb-4" />
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <div className="h-3 w-12 bg-muted rounded" />
              <div className="h-4 w-24 bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* 3. Bio skeleton */}
      <div className="mb-10 space-y-3">
        <div className="h-5 w-16 bg-muted rounded" />
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-5/6 bg-muted rounded" />
        <div className="h-4 w-4/6 bg-muted rounded" />
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-3/4 bg-muted rounded" />
      </div>

      {/* 4. Related stories skeleton */}
      <div className="mb-10">
        <div className="h-5 w-24 bg-muted rounded mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center rounded-lg p-4 border border-border"
            >
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="h-4 w-48 bg-muted rounded" />
                <div className="h-3 w-full bg-muted rounded" />
                <div className="h-3 w-3/4 bg-muted rounded" />
              </div>
              <div className="shrink-0 ml-4 h-4 w-4 bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* 5. Keywords skeleton */}
      <div className="mb-10 flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-6 w-16 bg-muted rounded-full" />
        ))}
      </div>

      {/* 6. Back link skeleton */}
      <div className="h-4 w-24 bg-muted rounded" />
    </div>
  );
}
