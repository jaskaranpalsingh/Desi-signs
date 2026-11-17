'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="divide-y divide-neutral-200 border-y border-neutral-200">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div key={idx} className="py-4 sm:py-5">
            <button
              onClick={() => toggle(idx)}
              className="w-full flex items-center justify-between text-left font-semibold text-neutral-900 hover:text-neutral-700 transition-colors cursor-pointer text-sm sm:text-base gap-4"
              aria-expanded={isOpen}
            >
              <span>{item.question}</span>
              <ChevronDown
                className={`w-4 h-4 text-neutral-500 shrink-0 transition-transform duration-200 ${
                  isOpen ? 'rotate-180 text-neutral-900' : ''
                }`}
              />
            </button>
            {isOpen && (
              <div className="mt-3 text-xs sm:text-sm text-neutral-600 leading-relaxed pr-6 animate-in fade-in duration-150">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

