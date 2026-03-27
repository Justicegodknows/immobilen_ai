"use client";

import { useMemo, useState } from "react";

type Listing = {
    id: string;
    title: string;
    district: string;
    monthlyRentEur: number;
    sizeM2: number;
    rooms: number;
    source: string;
    landlordName: string;
    commuteMinutesToCenter: number;
    noiseScore: number;
    vibeTags: string[];
    genossenschaftName?: string;
    priceAssessment: {
        expectedRentEur: number;
        deltaEur: number;
        isOverpriced: boolean;
        confidence: number;
    };
};

type ListingsResponse = {
    count: number;
    listings: Listing[];
};

type ScoreResponse = {
    tenantScore: {
        total: number;
        notes: string[];
    };
    success: {
        probability: number;
        reasons: string[];
    };
    genossenschaftMatch: {
        isEligible: boolean;
        eligibilityReasons: string[];
        handoffUrl: string;
        genossenschaftName: string;
    } | null;
};

export function PlatformDashboard() {
    const [district, setDistrict] = useState("");
    const [source, setSource] = useState("");
    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState<Listing[]>([]);
    const [selectedId, setSelectedId] = useState<string>("");
    const [score, setScore] = useState<ScoreResponse | null>(null);
    const [coverLetter, setCoverLetter] = useState("");
    const [chatInput, setChatInput] = useState("");
    const [chatReply, setChatReply] = useState("");

    const selectedListing = useMemo(
        () => listings.find((item) => item.id === selectedId) ?? null,
        [listings, selectedId],
    );

    async function searchListings() {
        setLoading(true);
        setScore(null);
        setCoverLetter("");

        const params = new URLSearchParams();
        if (district) params.set("district", district);
        if (source) params.set("source", source);

        const response = await fetch(`/api/listings?${params.toString()}`);
        const data = (await response.json()) as ListingsResponse;

        setListings(data.listings);
        setSelectedId(data.listings[0]?.id ?? "");
        setLoading(false);
    }

    async function analyzeListing() {
        if (!selectedId) return;

        const response = await fetch(`/api/tenant/score?listingId=${selectedId}`);
        const data = (await response.json()) as ScoreResponse;
        setScore(data);
    }

    async function generateLetter() {
        if (!selectedId) return;

        const response = await fetch("/api/tenant/cover-letter", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ listingId: selectedId }),
        });

        const data = (await response.json()) as { letter: string };
        setCoverLetter(data.letter);
    }

    async function askChatbot() {
        if (!chatInput.trim()) return;

        const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ message: chatInput }),
        });

        const data = (await response.json()) as { reply: string };
        setChatReply(data.reply);
    }

    return (
        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 md:px-8">
            <section className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
                <h1 className="text-2xl font-bold">Berlin AI Rental Platform</h1>
                <p className="mt-2 text-sm text-black/70">
                    Search listings, evaluate success probability, generate cover letters,
                    and connect with Wohnungsgenossenschaften.
                </p>
            </section>

            <section className="grid gap-4 rounded-2xl border border-black/10 bg-white p-5 md:grid-cols-4">
                <input
                    value={district}
                    onChange={(event) => setDistrict(event.target.value)}
                    placeholder="District (e.g. Pankow)"
                    className="rounded-xl border border-black/20 px-3 py-2"
                />
                <select
                    value={source}
                    onChange={(event) => setSource(event.target.value)}
                    className="rounded-xl border border-black/20 px-3 py-2"
                >
                    <option value="">All sources</option>
                    <option value="immobilienscout24">ImmobilienScout24</option>
                    <option value="immowelt">ImmoWelt</option>
                    <option value="kleinanzeigen">Kleinanzeigen</option>
                    <option value="genossenschaft">Wohnungsgenossenschaften</option>
                </select>
                <button
                    onClick={searchListings}
                    disabled={loading}
                    className="rounded-xl bg-black px-4 py-2 text-white"
                >
                    {loading ? "Searching..." : "Search Listings"}
                </button>
                <button
                    onClick={analyzeListing}
                    disabled={!selectedId}
                    className="rounded-xl border border-black px-4 py-2"
                >
                    Analyze Selected Listing
                </button>
            </section>

            <section className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-black/10 bg-white p-5">
                    <h2 className="text-lg font-semibold">Listings</h2>
                    <div className="mt-3 flex flex-col gap-3">
                        {listings.length === 0 && (
                            <p className="text-sm text-black/60">Run a search to load listings.</p>
                        )}
                        {listings.map((listing) => (
                            <button
                                key={listing.id}
                                onClick={() => setSelectedId(listing.id)}
                                className={`rounded-xl border p-3 text-left transition ${selectedId === listing.id
                                        ? "border-black bg-black text-white"
                                        : "border-black/15"
                                    }`}
                            >
                                <p className="font-semibold">{listing.title}</p>
                                <p className="text-sm opacity-80">
                                    {listing.district} | EUR {listing.monthlyRentEur} | {listing.sizeM2}m2
                                </p>
                                <p className="mt-1 text-xs opacity-80">
                                    Source: {listing.source}
                                    {listing.genossenschaftName
                                        ? ` (${listing.genossenschaftName})`
                                        : ""}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="rounded-2xl border border-black/10 bg-white p-5">
                    <h2 className="text-lg font-semibold">Listing Intelligence</h2>
                    {!selectedListing && (
                        <p className="mt-3 text-sm text-black/60">Select a listing first.</p>
                    )}
                    {selectedListing && (
                        <div className="mt-3 space-y-2 text-sm">
                            <p>Landlord: {selectedListing.landlordName}</p>
                            <p>Commute: {selectedListing.commuteMinutesToCenter} min</p>
                            <p>Noise score: {selectedListing.noiseScore} / 100</p>
                            <p>
                                Fair price check: expected EUR {selectedListing.priceAssessment.expectedRentEur}
                                , delta EUR {selectedListing.priceAssessment.deltaEur}
                            </p>
                            <p>
                                Overpriced: {selectedListing.priceAssessment.isOverpriced ? "Yes" : "No"}
                            </p>
                            <p>Vibe: {selectedListing.vibeTags.join(", ")}</p>
                        </div>
                    )}

                    {score && (
                        <div className="mt-4 rounded-xl border border-black/15 p-3 text-sm">
                            <p className="font-semibold">Tenant score: {score.tenantScore.total}/100</p>
                            <p>Success probability: {score.success.probability}%</p>
                            <p className="mt-2 font-medium">Reasoning:</p>
                            <ul className="list-disc pl-5">
                                {score.success.reasons.map((reason) => (
                                    <li key={reason}>{reason}</li>
                                ))}
                            </ul>

                            {score.genossenschaftMatch && (
                                <div className="mt-3 rounded-lg bg-black/5 p-2">
                                    <p className="font-semibold">
                                        Genossenschaft match: {score.genossenschaftMatch.genossenschaftName}
                                    </p>
                                    <p>
                                        Eligible: {score.genossenschaftMatch.isEligible ? "Yes" : "No"}
                                    </p>
                                    <a
                                        className="mt-1 inline-block underline"
                                        href={score.genossenschaftMatch.handoffUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Open handoff link
                                    </a>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-black/10 bg-white p-5">
                    <h2 className="text-lg font-semibold">AI Cover Letter</h2>
                    <button
                        onClick={generateLetter}
                        disabled={!selectedId}
                        className="mt-3 rounded-xl bg-black px-4 py-2 text-white"
                    >
                        Generate Letter
                    </button>
                    <textarea
                        value={coverLetter}
                        readOnly
                        className="mt-3 min-h-52 w-full rounded-xl border border-black/20 p-3 text-sm"
                        placeholder="Generated letter appears here"
                    />
                </div>

                <div className="rounded-2xl border border-black/10 bg-white p-5">
                    <h2 className="text-lg font-semibold">AI Chat Assistant</h2>
                    <div className="mt-3 flex gap-2">
                        <input
                            value={chatInput}
                            onChange={(event) => setChatInput(event.target.value)}
                            placeholder="Ask about price, genossenschaft, or cover letter"
                            className="flex-1 rounded-xl border border-black/20 px-3 py-2"
                        />
                        <button
                            onClick={askChatbot}
                            className="rounded-xl bg-black px-4 py-2 text-white"
                        >
                            Ask
                        </button>
                    </div>
                    <p className="mt-3 rounded-xl border border-black/15 p-3 text-sm">
                        {chatReply || "Chat response will appear here."}
                    </p>
                </div>
            </section>
        </main>
    );
}
