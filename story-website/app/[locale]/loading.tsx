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
