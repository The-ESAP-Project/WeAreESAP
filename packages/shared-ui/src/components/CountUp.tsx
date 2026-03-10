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

import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

interface CountUpProps {
  value: number;
  duration?: number;
  delay?: number;
  className?: string;
  suffix?: string;
}

export function CountUp({
  value,
  duration = 2,
  delay = 0,
  className,
  suffix = "",
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const shouldReduceMotion = useReducedMotion();

  const spring = useSpring(0, {
    duration: shouldReduceMotion ? 0 : duration * 1000,
    bounce: 0,
  });

  const display = useTransform(spring, (current) =>
    Math.round(current).toLocaleString()
  );

  useEffect(() => {
    if (isInView) {
      const timeout = setTimeout(() => {
        spring.set(value);
      }, delay * 1000);
      return () => clearTimeout(timeout);
    }
  }, [isInView, value, delay, spring]);

  return (
    <span ref={ref} className={className}>
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  );
}
