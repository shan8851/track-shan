"use client";

import { WEIGHT_TIME_RANGES } from "@/lib/constants";
import type { TimeRangeLabel } from "@/lib/constants";

type TimeRangeSelectorProps = {
  selected: TimeRangeLabel;
  onSelect: (label: TimeRangeLabel) => void;
};

export const TimeRangeSelector = ({ selected, onSelect }: TimeRangeSelectorProps) => (
  <div className="flex gap-1">
    {WEIGHT_TIME_RANGES.map((range) => (
      <button
        key={range.label}
        onClick={() => onSelect(range.label)}
        className={`px-3 py-1 text-xs font-medium border transition-colors ${
          selected === range.label
            ? "border-terminal bg-terminal/10 text-terminal"
            : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
        }`}
      >
        {range.label}
      </button>
    ))}
  </div>
);
