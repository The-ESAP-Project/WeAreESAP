// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItemProps {
  faq: {
    question: string;
    answer: string;
  };
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItem({ faq, isOpen, onToggle }: FAQItemProps) {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* 问题按钮 */}
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
      >
        <span className="font-semibold text-foreground pr-4">
          {faq.question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-esap-blue flex-shrink-0"
        >
          ▼
        </motion.span>
      </button>

      {/* 答案（可展开） */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-6 py-4 bg-muted/30 text-foreground/80 text-sm leading-relaxed border-t border-border">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface FAQAccordionProps {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export function FAQAccordion({ faqs }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState(0); // 默认打开第一个

  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => (
        <FAQItem
          key={index}
          faq={faq}
          isOpen={openIndex === index}
          onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
        />
      ))}
    </div>
  );
}
