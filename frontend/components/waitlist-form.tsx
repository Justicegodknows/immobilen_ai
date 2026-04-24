"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";

export type WaitlistFormSource = "landing_form" | "qr_landing";

type Props = {
    source?: WaitlistFormSource;
};

export function WaitlistForm({ source = "landing_form" }: Props) {
    const [email, setEmail] = useState("");
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);

    async function onSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);
        const trimmed = email.trim();
        if (!trimmed) {
            setError("Please enter your email.");
            return;
        }

        setPending(true);
        try {
            const res = await fetch("/api/waitlist", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ email: trimmed, source }),
            });
            const data = (await res.json()) as { success?: boolean; error?: string };
            if (!res.ok) {
                setError(data.error ?? "Something went wrong.");
                return;
            }
            // Any 2xx from this route means joined; don't rely on body shape alone.
            setSuccess(true);
        } catch {
            setError("Network error. Try again.");
        } finally {
            setPending(false);
        }
    }

    if (success) {
        return (
            <div className="rounded-2xl bg-primary/5 px-6 py-8 text-center">
                <p className="text-lg font-medium text-primary">
                    ✅ You&apos;re on the list! We&apos;ll be in touch soon.
                </p>
                <p className="mt-3 text-sm text-[#64748B]">
                    Changed your mind?{" "}
                    <Link
                        href={`/leave-waitlist?email=${encodeURIComponent(email)}`}
                        className="underline underline-offset-2 hover:text-[#94a3b8] transition-colors"
                    >
                        Leave the waitlist
                    </Link>
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                autoComplete="email"
                className="w-full border border-gray-300 bg-white px-4 py-3.5 font-sans text-black placeholder:text-gray-400 outline-none transition focus:border-black"
            />
            <button
                type="submit"
                disabled={pending}
                className="w-full rounded-md bg-black py-4 font-bold text-white transition hover:bg-gray-900 disabled:opacity-40"
            >
                {pending ? "Joining…" : "Join the Waitlist"}
            </button>
            {error && <p className="text-sm text-error">{error}</p>}
            <p className="text-center text-sm text-[#64748B]">
                No spam. No credit card. Unsubscribe anytime.
            </p>
        </form>
    );
}
