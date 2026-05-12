"use client";

import type { FilterWeight } from "@/lib/smart-feed";

const LEVEL_LABELS: Record<FilterWeight, string> = {
    1: "low",
    2: "fair",
    3: "high",
    4: "very high",
    5: "critical",
};

type WeightInputProps = {
    value: FilterWeight;
    onChange: (v: FilterWeight) => void;
    disabled?: boolean;
};

export default function WeightInput({ value, onChange, disabled }: WeightInputProps) {
    function handleKey(e: React.KeyboardEvent) {
        if (e.key === "ArrowRight" && value < 5) onChange((value + 1) as FilterWeight);
        if (e.key === "ArrowLeft"  && value > 1) onChange((value - 1) as FilterWeight);
    }

    return (
        <div className="flex flex-col items-center gap-1">
            <div
                role="radiogroup"
                aria-label="Priority weight"
                className={`flex items-end gap-[3px] ${disabled ? "opacity-40 pointer-events-none" : ""}`}
                onKeyDown={handleKey}
                tabIndex={disabled ? -1 : 0}
            >
                {([1, 2, 3, 4, 5] as FilterWeight[]).map((level) => {
                    const filled = level <= value;
                    const isCurrent = level === value;
                    return (
                        <button
                            key={level}
                            type="button"
                            role="radio"
                            aria-checked={isCurrent}
                            aria-label={`Priority level ${level}: ${LEVEL_LABELS[level]}`}
                            onClick={() => !disabled && onChange(level)}
                            className={[
                                "w-2 rounded-sm cursor-pointer transition-colors duration-150",
                                filled ? "bg-[#3ecfa0]" : "bg-gray-200",
                                isCurrent && filled ? "ring-1 ring-[#3ecfa0] ring-offset-1" : "",
                            ].join(" ")}
                            style={{ height: `${level * 4 + 6}px` }}
                        />
                    );
                })}
            </div>
            <span
                className={`font-mono text-[9px] uppercase tracking-widest leading-none ${
                    value >= 3 ? "text-[#3ecfa0]" : "text-gray-400"
                }`}
            >
                {LEVEL_LABELS[value]}
            </span>
        </div>
    );
}
