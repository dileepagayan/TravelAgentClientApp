import { INTEREST_OPTIONS } from "../data/seedData";
import type { Interest } from "../lib/types";

interface InterestSelectorProps {
  value: Interest[];
  onChange: (next: Interest[]) => void;
}

export function InterestSelector({ value, onChange }: InterestSelectorProps) {
  const toggle = (interest: Interest) => {
    if (value.includes(interest)) {
      onChange(value.filter((v) => v !== interest));
    } else {
      onChange([...value, interest]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {INTEREST_OPTIONS.map((opt) => {
        const active = value.includes(opt.value);
        return (
          <button
            type="button"
            key={opt.value}
            onClick={() => toggle(opt.value)}
            className={`group inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              active
                ? "border-brand-500 bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-sm"
                : "border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:text-brand-700"
            }`}
          >
            <span aria-hidden>{opt.emoji}</span>
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
