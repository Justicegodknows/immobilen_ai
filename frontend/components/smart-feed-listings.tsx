"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { getListings } from "@/lib/api";
import { scoreListing, type SmartFeedFilter } from "@/lib/smart-feed";
import { COMPANY_BASE_URLS } from "@/lib/company-urls";
import type { Listing } from "@/lib/types";

function ScoreBadge({ score }: { score: number }) {
    if (score >= 80) {
        return (
            <span className="absolute top-2 right-2 bg-[#3ecfa0] text-white font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5">
                Great match
            </span>
        );
    }
    if (score >= 60) {
        return (
            <span className="absolute top-2 right-2 border border-[#3ecfa0] text-[#3ecfa0] font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5">
                Good match
            </span>
        );
    }
    if (score >= 40) {
        return (
            <span className="absolute top-2 right-2 border border-gray-300 text-gray-400 font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5">
                Partial
            </span>
        );
    }
    return null;
}

function displayRent(listing: Listing): string {
    if (listing.warmRentAmount != null) return `€${listing.warmRentAmount}`;
    if (listing.coldRentAmount != null) return `€${listing.coldRentAmount}`;
    return "N/A";
}

type RankedListing = { listing: Listing; score: number };

type Props = { filters: SmartFeedFilter };

export default function SmartFeedListings({ filters }: Props) {
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [strongOnly, setStrongOnly] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await getListings({
                    limit: 48,
                    sortBy: "firstSeenAt",
                    sortOrder: "desc",
                    ...(filters.maxRent.enabled && {
                        maxWarmRent: Math.round(filters.maxRent.value * 1.3),
                    }),
                    ...(filters.minRooms.enabled && {
                        minRooms: Math.max(1, filters.minRooms.value - 1),
                    }),
                });
                setListings(res.data);
            } catch {
                setListings([]);
            } finally {
                setLoading(false);
            }
        }, 400);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [
        filters.maxRent.enabled,
        filters.maxRent.value,
        filters.minRooms.enabled,
        filters.minRooms.value,
    ]);

    const ranked: RankedListing[] = useMemo(
        () =>
            listings
                .map((l) => ({ listing: l, score: scoreListing(l, filters) }))
                .sort((a, b) => b.score - a.score),
        [listings, filters],
    );

    const displayed = strongOnly ? ranked.filter((r) => r.score >= 60) : ranked;

    if (loading) {
        return (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                        <div className="aspect-video w-full bg-gray-100 rounded-none" />
                        <div className="mt-3 space-y-2 px-0.5">
                            <div className="h-3 bg-gray-100 rounded w-3/4" />
                            <div className="h-3 bg-gray-100 rounded w-1/2" />
                            <div className="h-4 bg-gray-100 rounded w-1/3 mt-1" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (displayed.length === 0) {
        return (
            <div className="py-12 text-center">
                <p className="text-sm text-gray-400">No listings match your current filters.</p>
                <Link href="/search" className="mt-2 inline-block text-xs font-semibold text-[#3ecfa0] hover:underline">
                    Browse all listings →
                </Link>
            </div>
        );
    }

    return (
        <div>
            {/* Controls */}
            <div className="mb-4 flex items-center justify-between">
                <p className="font-mono text-xs text-gray-400">
                    {displayed.length} listing{displayed.length !== 1 ? "s" : ""} ranked
                </p>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                    <span className="text-xs text-gray-400">Strong matches only</span>
                    <button
                        type="button"
                        onClick={() => setStrongOnly((v) => !v)}
                        className={`w-8 h-4 relative transition-colors ${strongOnly ? "bg-[#3ecfa0]" : "bg-gray-200"}`}
                        aria-pressed={strongOnly}
                    >
                        <span
                            className={`absolute top-0.5 w-3 h-3 bg-white transition-transform ${
                                strongOnly ? "translate-x-4" : "translate-x-0.5"
                            }`}
                        />
                    </button>
                </label>
            </div>

            {/* Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {displayed.map(({ listing, score }) => (
                    <a
                        key={listing.id}
                        href={`/listings/${listing.id}`}
                        className="group block bg-white border border-gray-100 hover:border-gray-300 transition-colors"
                    >
                        {/* Image */}
                        <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                            {listing.imageUrls.length > 0 && COMPANY_BASE_URLS[listing.source] ? (
                                <img
                                    src={`${COMPANY_BASE_URLS[listing.source] ?? ""}${listing.imageUrls[0]}`}
                                    alt={listing.title}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-xs text-gray-400">
                                    No image
                                </div>
                            )}
                            <ScoreBadge score={score} />
                            {/* Score bar */}
                            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gray-200">
                                <div
                                    className="h-full bg-[#3ecfa0] transition-all duration-500"
                                    style={{ width: `${score}%` }}
                                />
                            </div>
                        </div>

                        {/* Info */}
                        <div className="p-3">
                            <h3 className="text-sm font-semibold leading-snug group-hover:underline line-clamp-2">
                                {listing.title}
                            </h3>
                            <p className="mt-1 text-xs text-gray-400 truncate">
                                {listing.address ?? listing.city ?? "—"}
                            </p>
                            <div className="mt-2 flex items-center justify-between">
                                <span className="text-base font-bold text-black">{displayRent(listing)}</span>
                                <span className="text-xs text-gray-400">
                                    {listing.areaM2 != null ? `${listing.areaM2}m²` : ""}
                                    {listing.rooms != null ? ` · ${listing.rooms}r` : ""}
                                </span>
                            </div>
                            {listing.features.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-1">
                                    {listing.features.slice(0, 2).map((f) => (
                                        <span key={f} className="text-[10px] text-gray-400 border border-gray-200 px-1.5 py-0.5">
                                            {f}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </a>
                ))}
            </div>

            {/* Footer */}
            <div className="mt-6 text-center">
                <Link
                    href="/search"
                    className="text-xs font-semibold text-gray-400 hover:text-black transition-colors"
                >
                    See all listings in Search →
                </Link>
            </div>
        </div>
    );
}
