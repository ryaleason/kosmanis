'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  // Item pertama terbuka secara default (index 0)
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="divide-y divide-[#E5E7EB] border-t border-[#E5E7EB]">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index} className="py-4">
            <button
              type="button"
              onClick={() => toggle(index)}
              className="w-full flex items-center justify-between gap-4 text-left group cursor-pointer focus:outline-none"
              aria-expanded={isOpen}
            >
              <span className="text-base font-semibold text-[#1F2937] group-hover:text-[#1CA3D4] transition-colors">
                {item.question}
              </span>
              <span className="shrink-0 text-[#1CA3D4]">
                {isOpen ? (
                  <Minus className="w-5 h-5 stroke-[2]" />
                ) : (
                  <Plus className="w-5 h-5 stroke-[2]" />
                )}
              </span>
            </button>
            {isOpen && (
              <div className="pt-2 pb-1 pr-6">
                <p className="text-[15px] text-[#6B7280] leading-[1.7]">
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
