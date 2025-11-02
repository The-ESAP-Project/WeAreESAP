"use client";

import { motion } from "framer-motion";

interface ChecklistItemProps {
  text: string;
  type: "positive" | "negative";
  index: number;
}

export function ChecklistItem({ text, type, index }: ChecklistItemProps) {
  const isPositive = type === "positive";

  return (
    <motion.li
      className="flex items-center gap-3"
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <span
        className={`text-lg flex-shrink-0 ${
          isPositive ? "text-green-500" : "text-red-500"
        }`}
      >
        {isPositive ? "✅" : "❌"}
      </span>
      <span className="text-sm text-foreground/80">{text}</span>
    </motion.li>
  );
}
