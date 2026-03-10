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

"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold text-foreground">Error</h1>
      <p className="mt-4 text-muted-foreground">
        {error.message || "Something went wrong."}
      </p>
      <button
        onClick={reset}
        className="mt-8 px-6 py-3 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
      >
        Try Again
      </button>
    </div>
  );
}
