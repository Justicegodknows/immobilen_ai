"use client";

import { useState, useEffect, useRef } from "react";

const SOURCES = ["Scout24", "WG-Gesucht", "eBay Klein.", "Immowelt"];

const ALL_LISTINGS = [
    { id: 1, source: "Scout24", rooms: "2-Zi., 65 m²", area: "Mitte", price: "€1.200" },
    { id: 2, source: "WG-Gesucht", rooms: "3-Zi., 80 m²", area: "Prenzlauer Berg", price: "€1.650" },
    { id: 3, source: "eBay Klein.", rooms: "1-Zi., 40 m²", area: "Friedrichshain", price: "€890" },
    { id: 4, source: "Immowelt", rooms: "4-Zi., 95 m²", area: "Charlottenburg", price: "€2.100" },
    { id: 5, source: "Scout24", rooms: "Studio, 28 m²", area: "Neukölln", price: "€700" },
    { id: 6, source: "WG-Gesucht", rooms: "2-Zi., 58 m²", area: "Kreuzberg", price: "€1.100" },
];

type FeedItem = { listing: (typeof ALL_LISTINGS)[0]; key: string };

export function ListingFeedAnimation() {
    const [feedItems, setFeedItems] = useState<FeedItem[]>([
        { listing: ALL_LISTINGS[0], key: "init-0" },
        { listing: ALL_LISTINGS[1], key: "init-1" },
        { listing: ALL_LISTINGS[2], key: "init-2" },
    ]);
    const [activeSource, setActiveSource] = useState<string | null>(null);
    const cursorRef = useRef(3);
    const genRef = useRef(0);

    useEffect(() => {
        const t = setInterval(() => {
            const cursor = cursorRef.current;
            const next = ALL_LISTINGS[cursor % ALL_LISTINGS.length];
            const gen = ++genRef.current;

            setActiveSource(next.source);
            setFeedItems((prev) => [
                { listing: next, key: `${next.id}-${gen}` },
                ...prev.slice(0, 2),
            ]);
            cursorRef.current = cursor + 1;

            setTimeout(() => setActiveSource(null), 900);
        }, 2200);
        return () => clearInterval(t);
    }, []);

    return (
        <div className="w-full max-w-xs">
            {/* Source platform badges */}
            <div className="mb-5 flex flex-wrap gap-2">
                {SOURCES.map((s) => (
                    <span
                        key={s}
                        className={`border px-2.5 py-1 text-xs font-semibold transition-all duration-300 ${
                            activeSource === s
                                ? "border-black bg-black text-white"
                                : "border-gray-200 bg-white text-gray-400"
                        }`}
                    >
                        {s}
                    </span>
                ))}
            </div>

            {/* Connector */}
            <div className="mb-4 flex items-center gap-3">
                <div className="flex-1 border-t border-dashed border-gray-300" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400">
                    aggregating
                </span>
                <div className="flex-1 border-t border-dashed border-gray-300" />
            </div>

            {/* Live feed panel */}
            <div className="overflow-hidden border border-black">
                <div className="flex items-center gap-2 bg-black px-4 py-2.5 text-white">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em]">
                        Live Feed
                    </span>
                </div>

                <div className="divide-y divide-gray-100">
                    {feedItems.map(({ listing, key }, i) => (
                        <div
                            key={key}
                            className="group cursor-default bg-white px-4 py-3 transition-colors duration-150 hover:bg-gray-50"
                            style={
                                i === 0
                                    ? { animation: "slideInTop 0.4s ease-out" }
                                    : undefined
                            }
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-black">
                                        {listing.rooms}
                                    </p>
                                    <p className="mt-0.5 text-xs text-gray-400">{listing.area}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-black">{listing.price}</p>
                                    <p className="mt-0.5 font-mono text-[10px] text-gray-400">
                                        {listing.source}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
