"use client";

import { motion } from "framer-motion";

interface ValueCardProps {
  value: {
    title: string;
    quote: string;
    description: string;
    icon: string;
  };
  index: number;
}

export function ValueCard({ value, index }: ValueCardProps) {
  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <div className="bg-muted rounded-xl p-6 h-full border border-border hover:border-esap-yellow/50 transition-all duration-300">
        {/* 图标和标题 */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">{value.icon}</span>
          <h3 className="text-xl font-bold text-foreground">{value.title}</h3>
        </div>

        {/* 引言 */}
        <blockquote className="text-sm italic text-muted-foreground mb-3 border-l-2 border-esap-yellow/30 pl-3">
          "{value.quote}"
        </blockquote>

        {/* 描述 */}
        <p className="text-sm text-foreground/70">{value.description}</p>

        {/* 底部光效 */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-esap-yellow via-esap-pink to-esap-blue opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-b-xl" />
      </div>
    </motion.div>
  );
}
