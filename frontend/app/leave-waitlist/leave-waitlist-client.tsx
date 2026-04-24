"use client";

import { useState } from "react";
import Link from "next/link";

type Props = {
    email: string;
};

export function LeaveWaitlistClient({ email }: Props) {
    const [state, setState] = useState<"confirm" | "done" | "not-found" | "error">("confirm");
    const [pending, setPending] = useState(false);

    async function handleLeave() {
        setPending(true);
        try {
            const res = await fetch("/api/waitlist", {
                method: "DELETE",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = (await res.json()) as { success?: boolean; deleted?: boolean; error?: string };
            if (!res.ok) {
                setState("error");
                return;
            }
            setState(data.deleted ? "done" : "not-found");
        } catch {
            setState("error");
        } finally {
            setPending(false);
        }
    }

    return (
        <>
            {/* Nav */}
            <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-gray-200 bg-white">
                <div className="mx-auto flex h-full max-w-6xl items-center px-6 md:px-10">
                    <Link href="/" className="text-lg font-bold tracking-tighter text-black">
                        Budenfinder
                    </Link>
                </div>
            </header>

            {/* Main */}
            <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 pt-16">
                <div className="w-full max-w-md text-center">

                    {state === "confirm" && (
                        <>
                            <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-gray-400">
                                Waitlist
                            </p>
                            <h1 className="text-4xl font-black tracking-tight text-black md:text-5xl">
                                Leave the
                                <br />
                                Waitlist?
                            </h1>
                            <p className="mt-4 text-base leading-relaxed text-gray-500">
                                This will remove{" "}
                                <span className="font-medium text-black">{email}</span>{" "}
                                from our list. You will lose your spot and would need to sign up again.
                            </p>
                            <div className="mt-10 flex flex-col gap-3">
                                <button
                                    onClick={handleLeave}
                                    disabled={pending}
                                    className="w-full rounded-md bg-black py-4 font-bold text-white transition-colors hover:bg-gray-900 disabled:opacity-40"
                                >
                                    {pending ? "Removing…" : "Yes, leave the waitlist"}
                                </button>
                                <Link
                                    href="/#waitlist"
                                    className="w-full rounded-md border border-gray-300 py-4 font-bold text-black transition-colors hover:bg-gray-50 block"
                                >
                                    No, keep my spot
                                </Link>
                            </div>
                        </>
                    )}

                    {state === "done" && (
                        <>
                            <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-gray-400">
                                Done
                            </p>
                            <h1 className="text-4xl font-black tracking-tight text-black md:text-5xl">
                                You&apos;ve been
                                <br />
                                removed.
                            </h1>
                            <p className="mt-4 text-base leading-relaxed text-gray-500">
                                <span className="font-medium text-black">{email}</span> is no longer on the waitlist. We hope to see you again.
                            </p>
                            <div className="mt-10">
                                <Link
                                    href="/"
                                    className="inline-block rounded-md bg-black px-8 py-4 font-bold text-white transition-colors hover:bg-gray-900"
                                >
                                    Back to homepage
                                </Link>
                            </div>
                        </>
                    )}

                    {state === "not-found" && (
                        <>
                            <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-gray-400">
                                Not Found
                            </p>
                            <h1 className="text-4xl font-black tracking-tight text-black md:text-5xl">
                                Not on the
                                <br />
                                list.
                            </h1>
                            <p className="mt-4 text-base leading-relaxed text-gray-500">
                                <span className="font-medium text-black">{email}</span> is not on the waitlist.
                            </p>
                            <div className="mt-10">
                                <Link
                                    href="/"
                                    className="inline-block rounded-md bg-black px-8 py-4 font-bold text-white transition-colors hover:bg-gray-900"
                                >
                                    Back to homepage
                                </Link>
                            </div>
                        </>
                    )}

                    {state === "error" && (
                        <>
                            <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-gray-400">
                                Error
                            </p>
                            <h1 className="text-4xl font-black tracking-tight text-black md:text-5xl">
                                Something
                                <br />
                                went wrong.
                            </h1>
                            <p className="mt-4 text-base leading-relaxed text-gray-500">
                                Please try again. If the problem persists, contact us.
                            </p>
                            <div className="mt-10">
                                <button
                                    onClick={() => setState("confirm")}
                                    className="inline-block rounded-md bg-black px-8 py-4 font-bold text-white transition-colors hover:bg-gray-900"
                                >
                                    Try again
                                </button>
                            </div>
                        </>
                    )}

                </div>
            </main>
        </>
    );
}
