"use client";

import { useState } from "react";
import WeightInput from "@/components/weight-input";
import { DEFAULT_SMART_FEED, type SmartFeedFilter, type FilterWeight } from "@/lib/smart-feed";

type Props = {
    filters: SmartFeedFilter;
    onChange: (f: SmartFeedFilter) => void;
    onSave: () => void;
    defaultOpen?: boolean;
};

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={on}
            className={`w-4 h-4 flex-shrink-0 flex items-center justify-center transition-colors ${
                on ? "bg-[#3ecfa0]" : "bg-gray-200"
            }`}
            title={on ? "Enabled" : "Disabled"}
        >
            {on && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M1.5 5l2.5 2.5 4.5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )}
        </button>
    );
}

function buildSummary(filters: SmartFeedFilter): string {
    const parts: string[] = [];
    if (filters.maxRent.enabled)   parts.push(`Rent ≤ €${filters.maxRent.value}`);
    if (filters.minRooms.enabled)  parts.push(`${filters.minRooms.value}+ rooms`);
    if (filters.minAreaM2.enabled) parts.push(`${filters.minAreaM2.value}m²`);
    if (filters.districts.enabled && filters.districts.value.length > 0)
        parts.push(filters.districts.value.slice(0, 2).join(", "));
    if (filters.wbsOnly.enabled && filters.wbsOnly.value) parts.push("WBS only");
    return parts.length ? parts.join(" · ") : "No active filters";
}

export default function SmartFeedFilterPanel({ filters, onChange, onSave, defaultOpen = false }: Props) {
    const [open, setOpen] = useState(defaultOpen);

    function setDimension<K extends keyof SmartFeedFilter>(
        key: K,
        patch: Partial<SmartFeedFilter[K]>,
    ) {
        onChange({ ...filters, [key]: { ...filters[key], ...patch } });
    }

    return (
        <div className="border border-gray-200 bg-white">
            {/* Header / collapsed row */}
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-4 min-w-0">
                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-gray-500 flex-shrink-0">
                        Filters
                    </span>
                    {!open && (
                        <span className="text-xs text-gray-400 truncate">{buildSummary(filters)}</span>
                    )}
                </div>
                <span
                    className="material-symbols-outlined text-gray-400 flex-shrink-0 transition-transform duration-200"
                    style={{
                        fontSize: "20px",
                        transform: open ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                >
                    expand_more
                </span>
            </button>

            {/* Expanded content */}
            {open && (
                <div className="border-t border-gray-100 px-5 py-5">
                    <div className="grid gap-3 sm:grid-cols-2">

                        {/* Max Rent */}
                        <div className="flex items-center gap-3 py-2">
                            <Toggle
                                on={filters.maxRent.enabled}
                                onClick={() => setDimension("maxRent", { enabled: !filters.maxRent.enabled })}
                            />
                            <div className="flex-1 min-w-0">
                                <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                                    Max warm rent
                                </p>
                                <div className={`flex items-center gap-1 ${!filters.maxRent.enabled ? "opacity-40 pointer-events-none" : ""}`}>
                                    <span className="text-xs text-gray-500">€</span>
                                    <input
                                        type="number"
                                        value={filters.maxRent.value}
                                        min={0}
                                        onChange={(e) =>
                                            setDimension("maxRent", { value: Number(e.target.value) })
                                        }
                                        className="ds-input w-full text-sm"
                                    />
                                </div>
                            </div>
                            <WeightInput
                                value={filters.maxRent.weight}
                                onChange={(w: FilterWeight) => setDimension("maxRent", { weight: w })}
                                disabled={!filters.maxRent.enabled}
                            />
                        </div>

                        {/* Min Rooms */}
                        <div className="flex items-center gap-3 py-2">
                            <Toggle
                                on={filters.minRooms.enabled}
                                onClick={() => setDimension("minRooms", { enabled: !filters.minRooms.enabled })}
                            />
                            <div className="flex-1 min-w-0">
                                <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                                    Minimum rooms
                                </p>
                                <select
                                    value={filters.minRooms.value}
                                    onChange={(e) =>
                                        setDimension("minRooms", { value: Number(e.target.value) })
                                    }
                                    className={`ds-input w-full text-sm ${!filters.minRooms.enabled ? "opacity-40 pointer-events-none" : ""}`}
                                    title="Minimum rooms"
                                >
                                    {[1, 2, 3, 4, 5].map((n) => (
                                        <option key={n} value={n}>{n}+ room{n > 1 ? "s" : ""}</option>
                                    ))}
                                </select>
                            </div>
                            <WeightInput
                                value={filters.minRooms.weight}
                                onChange={(w: FilterWeight) => setDimension("minRooms", { weight: w })}
                                disabled={!filters.minRooms.enabled}
                            />
                        </div>

                        {/* Min Area */}
                        <div className="flex items-center gap-3 py-2">
                            <Toggle
                                on={filters.minAreaM2.enabled}
                                onClick={() => setDimension("minAreaM2", { enabled: !filters.minAreaM2.enabled })}
                            />
                            <div className="flex-1 min-w-0">
                                <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                                    Minimum area
                                </p>
                                <div className={`flex items-center gap-1 ${!filters.minAreaM2.enabled ? "opacity-40 pointer-events-none" : ""}`}>
                                    <input
                                        type="number"
                                        value={filters.minAreaM2.value}
                                        min={0}
                                        onChange={(e) =>
                                            setDimension("minAreaM2", { value: Number(e.target.value) })
                                        }
                                        className="ds-input w-full text-sm"
                                    />
                                    <span className="text-xs text-gray-500 flex-shrink-0">m²</span>
                                </div>
                            </div>
                            <WeightInput
                                value={filters.minAreaM2.weight}
                                onChange={(w: FilterWeight) => setDimension("minAreaM2", { weight: w })}
                                disabled={!filters.minAreaM2.enabled}
                            />
                        </div>

                        {/* Districts */}
                        <div className="flex items-center gap-3 py-2">
                            <Toggle
                                on={filters.districts.enabled}
                                onClick={() => setDimension("districts", { enabled: !filters.districts.enabled })}
                            />
                            <div className="flex-1 min-w-0">
                                <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                                    Preferred districts
                                </p>
                                <input
                                    type="text"
                                    value={filters.districts.value.join(", ")}
                                    placeholder="Mitte, Prenzlauer Berg…"
                                    onChange={(e) =>
                                        setDimension("districts", {
                                            value: e.target.value
                                                .split(",")
                                                .map((s) => s.trim())
                                                .filter(Boolean),
                                        })
                                    }
                                    className={`ds-input w-full text-sm ${!filters.districts.enabled ? "opacity-40 pointer-events-none" : ""}`}
                                />
                            </div>
                            <WeightInput
                                value={filters.districts.weight}
                                onChange={(w: FilterWeight) => setDimension("districts", { weight: w })}
                                disabled={!filters.districts.enabled}
                            />
                        </div>

                        {/* WBS Only */}
                        <div className="flex items-center gap-3 py-2 sm:col-span-2">
                            <Toggle
                                on={filters.wbsOnly.enabled}
                                onClick={() => setDimension("wbsOnly", { enabled: !filters.wbsOnly.enabled })}
                            />
                            <div className="flex-1 min-w-0">
                                <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-0.5">
                                    WBS listings only
                                </p>
                                <p className="text-xs text-gray-400">
                                    Prioritise subsidised housing (Wohnberechtigungsschein)
                                </p>
                            </div>
                            <WeightInput
                                value={filters.wbsOnly.weight}
                                onChange={(w: FilterWeight) => setDimension("wbsOnly", { weight: w })}
                                disabled={!filters.wbsOnly.enabled}
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-5 flex items-center gap-4 border-t border-gray-100 pt-4">
                        <button type="button" onClick={onSave} className="btn-primary text-sm">
                            Apply
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                onChange(DEFAULT_SMART_FEED);
                                onSave();
                            }}
                            className="text-xs text-gray-400 hover:text-black transition-colors"
                        >
                            Reset to defaults
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
