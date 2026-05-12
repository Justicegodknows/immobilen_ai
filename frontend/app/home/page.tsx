"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { OnboardingStorage } from "@/lib/types";
import SmartFeedFilterPanel from "@/components/smart-feed-filter-panel";
import SmartFeedListings from "@/components/smart-feed-listings";
import {
    loadSmartFeedFilter,
    saveSmartFeedFilter,
    DEFAULT_SMART_FEED,
    type SmartFeedFilter,
} from "@/lib/smart-feed";

const MAX_XP = 375;

const FEATURE_CARDS = [
    {
        href: "/search",
        icon: "travel_explore",
        title: "Smart Feed",
        description:
            "AI-ranked listings matching your profile in real time.",
    },
    {
        href: "/chat",
        icon: "chat_bubble",
        title: "AI Assistant",
        description:
            "Ask anything about Berlin renting, contracts, or your chances.",
    },
    {
        href: "/intelligence",
        icon: "insights",
        title: "Intelligence",
        description:
            "District trends, rent cap analysis, and market predictions.",
    },
    {
        href: "/tracker",
        icon: "timeline",
        title: "Application Tracker",
        description:
            "Full timeline, viewing reminders, and rejection analysis.",
    },
];

export default function HomePage() {
    const [stored, setStored] = useState<OnboardingStorage | null>(null);
    const [smartFeedFilters, setSmartFeedFilters] = useState<SmartFeedFilter>(DEFAULT_SMART_FEED);
    const [feedPanelOpen, setFeedPanelOpen] = useState(false);

    useEffect(() => {
        try {
            const raw = localStorage.getItem("budenfinder.onboarding");
            if (raw) setStored(JSON.parse(raw) as OnboardingStorage);
        } catch {}
    }, []);

    useEffect(() => {
        setSmartFeedFilters(loadSmartFeedFilter());
    }, []);

    const xp = stored?.totalXp ?? 0;
    const name = stored?.name;
    const pct = Math.min(100, Math.round((xp / MAX_XP) * 100));
    const isComplete = xp >= MAX_XP;

    return (
        <div className="min-h-screen bg-white">
            {/* ── Dark hero band ── */}
            <section className="bg-black px-6 py-16 md:py-20 md:px-10 lg:px-16">
                <div className="max-w-5xl mx-auto">
                    <p className="font-mono text-xs uppercase tracking-[0.3em] text-gray-400">
                        Your Dashboard
                    </p>
                    <h1 className="mt-3 text-5xl font-black leading-none tracking-tight text-white md:text-6xl">
                        Welcome{name ? `, ${name}` : " back"}.
                    </h1>
                    <p className="mt-4 text-base text-gray-400 max-w-md">
                        {isComplete
                            ? "Your profile is complete. All AI features are active."
                            : "Complete your profile to unlock the full Budenfinder experience."}
                    </p>

                    {/* XP / Profile strength card */}
                    <div className="mt-8 rounded-md border border-white/15 p-6 max-w-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold text-white">
                                Profile Strength
                            </span>
                            <span className="font-mono text-sm font-bold text-[#3ecfa0]">
                                {xp} / {MAX_XP} XP
                            </span>
                        </div>
                        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                            <div
                                className="h-full rounded-full bg-[#3ecfa0] transition-all duration-1000"
                                style={{ width: `${pct}%` }}
                            />
                        </div>
                        <p className="mt-2 text-xs text-gray-500">
                            {isComplete
                                ? "Profile complete — all features unlocked"
                                : `${MAX_XP - xp} XP remaining to complete your profile`}
                        </p>
                        {!isComplete && (
                            <Link
                                href="/onboarding"
                                className="mt-4 inline-block text-xs font-semibold text-[#3ecfa0] hover:underline"
                            >
                                Complete onboarding →
                            </Link>
                        )}
                    </div>
                </div>
            </section>

            {/* ── Feature cards ── */}
            <section className="px-6 py-14 md:py-16 md:px-10 lg:px-16">
                <div className="max-w-5xl mx-auto">
                    <p className="mb-8 font-mono text-xs uppercase tracking-[0.3em] text-gray-400">
                        Your Tools
                    </p>
                    <div className="grid border-t border-l border-gray-200 sm:grid-cols-2 lg:grid-cols-4">
                        {FEATURE_CARDS.map((card) => (
                            <Link
                                key={card.href}
                                href={card.href}
                                className="group cursor-default flex flex-col gap-5 border-b border-r border-gray-200 bg-white p-8 transition-colors duration-200 hover:bg-gray-50 md:p-10"
                            >
                                <span
                                    className="material-symbols-outlined text-black transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5"
                                    style={{ fontSize: "28px", fontVariationSettings: '"FILL" 0, "wght" 300, "GRAD" 0, "opsz" 28' }}
                                >
                                    {card.icon}
                                </span>
                                <div className="flex-1">
                                    <h3 className="mt-3 text-base font-bold text-black">
                                        {card.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-gray-500">
                                        {card.description}
                                    </p>
                                </div>
                                <span className="mt-auto text-xs font-semibold text-[#3ecfa0] group-hover:underline">
                                    Open →
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Smart Feed ── */}
            <section className="px-6 pt-14 pb-0 md:px-10 lg:px-16">
                <div className="max-w-5xl mx-auto flex items-center justify-between mb-6">
                    <div>
                        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#3ecfa0]">Smart Feed</p>
                        <h2 className="mt-1 text-2xl font-black tracking-tight text-black">Ranked for you.</h2>
                    </div>
                    <button
                        onClick={() => setFeedPanelOpen((v) => !v)}
                        className="btn-secondary flex items-center gap-2 text-sm"
                    >
                        <span
                            className="material-symbols-outlined"
                            style={{ fontSize: "16px", fontVariationSettings: '"FILL" 0, "wght" 300, "GRAD" 0, "opsz" 16' }}
                        >
                            tune
                        </span>
                        {feedPanelOpen ? "Close" : "Tune feed"}
                    </button>
                </div>
                {feedPanelOpen && (
                    <div className="max-w-5xl mx-auto mb-6">
                        <SmartFeedFilterPanel
                            filters={smartFeedFilters}
                            onChange={setSmartFeedFilters}
                            onSave={() => {
                                saveSmartFeedFilter(smartFeedFilters);
                                setFeedPanelOpen(false);
                            }}
                        />
                    </div>
                )}
            </section>

            <section className="px-6 pb-14 md:px-10 lg:px-16">
                <div className="max-w-7xl mx-auto">
                    <SmartFeedListings filters={smartFeedFilters} />
                </div>
            </section>

            {/* ── Quick links ── */}
            <section className="border-t border-gray-100 px-6 py-6 md:px-10">
                <div className="max-w-5xl mx-auto flex flex-wrap gap-6">
                    <Link
                        href="/onboarding"
                        className="text-xs text-gray-400 transition-colors hover:text-black"
                    >
                        Edit profile
                    </Link>
                    <Link
                        href="/search"
                        className="text-xs text-gray-400 transition-colors hover:text-black"
                    >
                        Browse listings
                    </Link>
                    <Link
                        href="/tracker"
                        className="text-xs text-gray-400 transition-colors hover:text-black"
                    >
                        My applications
                    </Link>
                </div>
            </section>
        </div>
    );
}
