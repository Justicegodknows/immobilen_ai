"use client";

import Link from "next/link";

export default function ApplicationsPage() {

    return (
        <div className="min-h-screen bg-white">
            <section className="px-6 py-16 md:py-20 md:px-10 lg:px-16">
                <div className="max-w-5xl mx-auto">
                    <p className="font-mono text-xs uppercase tracking-[0.3em] text-gray-400">
                        Your Applications
                    </p>
                    <h1 className="mt-3 text-5xl font-black leading-none tracking-tight text-black md:text-6xl">
                        Manage your rental applications.
                    </h1>
                    <p className="mt-4 text-base text-gray-400 max-w-md">
                        View and track all your rental applications in one place.
                    </p>

                    <div className="mt-8 rounded-md border border-gray-200 p-6 max-w-sm">
                        <p className="text-sm font-semibold text-gray-700">
                            You have no active applications.
                        </p>
                        <Link
                            href="/home"
                            className="mt-4 inline-block rounded-md bg-black px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-900"
                        >
                            Explore Listings
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
