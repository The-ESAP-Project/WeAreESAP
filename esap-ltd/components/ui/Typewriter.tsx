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

import { useReducedMotion } from "@esap/shared-ui";
import { useEffect, useRef, useState } from "react";

export function Typewriter({
  text,
  speed = 60,
  delay = 300,
  className,
}: {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
}) {
  // Initialize with full text so SSR/no-JS always shows the title
  const [displayed, setDisplayed] = useState(text);
  const [done, setDone] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Mark hydration complete
  useEffect(() => {
    setHydrated(true);
  }, []);

  // Only animate after hydration, and only if motion is allowed
  useEffect(() => {
    if (!hydrated || shouldReduceMotion) return;

    setDisplayed("");
    setDone(false);

    const timeout = setTimeout(() => {
      let i = 0;
      intervalRef.current = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          intervalRef.current = null;
          setDone(true);
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [hydrated, text, speed, delay, shouldReduceMotion]);

  return (
    <span className={className}>
      {displayed}
      {hydrated && (
        <span
          className={`inline-block w-[3px] h-[0.85em] ml-1 align-middle bg-esap-pink ${
            done ? "animate-blink" : ""
          }`}
          aria-hidden="true"
        />
      )}
    </span>
  );
}
