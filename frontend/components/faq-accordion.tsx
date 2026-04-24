"use client";

import { useState } from "react";

type FaqItem = { q: string; a: string };

export function FaqAccordion({ items }: { items: FaqItem[] }) {
    const [open, setOpen] = useState<number | null>(null);

    return (
        <div className="border-t border-l border-white/15">
            {items.map((item, i) => (
                <div key={i} className="border-b border-r border-white/15">
                    <button
                        type="button"
                        onClick={() => setOpen(open === i ? null : i)}
                        className="flex w-full cursor-pointer items-start justify-between gap-6 px-4 py-4 md:px-8 md:py-6 lg:px-10 text-left transition-colors duration-150 hover:bg-zinc-950"
                    >
                        <span className="text-base font-semibold text-white">{item.q}</span>
                        <span
                            className="mt-0.5 shrink-0 text-gray-400 transition-transform duration-300"
                            style={{ transform: open === i ? "rotate(45deg)" : "rotate(0deg)" }}
                        >
                            +
                        </span>
                    </button>

                    <div
                        className="overflow-hidden transition-all duration-300 ease-in-out"
                        style={{ maxHeight: open === i ? "400px" : "0px" }}
                    >
                        <p className="px-4 pb-4 md:px-8 md:pb-6 lg:px-10 text-sm leading-relaxed text-gray-300">
                            {item.a}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
