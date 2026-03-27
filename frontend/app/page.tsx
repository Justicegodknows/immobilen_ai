"use client";

import Link from "next/link";

export default function Home() {
    return (
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-12 md:px-8">
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-3xl bg-on-background p-8 text-white md:p-16">
                {/* Glowing blobs */}
                <div className="blob-mint absolute -left-24 -top-24 h-72 w-72" />
                <div className="blob-blue absolute right-0 top-1/3 h-64 w-64" />
                <div className="blob-rose absolute -bottom-16 left-1/3 h-56 w-56" />

                <div className="relative z-10">
                    <p className="text-label mb-4 text-primary">AI-POWERED APARTMENT SEARCH</p>
                    <h1 className="text-display max-w-3xl">
                        Find Your Home in Berlin
                    </h1>
                    <p className="mt-6 max-w-2xl text-lg text-white/70">
                        AI-powered apartment search, application tracking, and Genossenschaft matching.
                        Get your dream home faster with intelligent recommendations.
                    </p>
                    <div className="mt-10 flex flex-wrap gap-4">
                        <Link
                            href="/search"
                            className="btn-primary inline-flex items-center"
                        >
                            Start Searching →
                        </Link>
                        <Link
                            href="/chat"
                            className="btn-secondary inline-flex items-center !text-white"
                            style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.2)' }}
                        >
                            Ask AI Assistant
                        </Link>
                    </div>
                </div>
            </section>

            {/* Quick Stats */}
            <section className="grid gap-4 md:grid-cols-4">
                <StatCard value="2,500+" label="Active Listings" subtext="Across Berlin" />
                <StatCard value="85%" label="Application Success" subtext="With our tools" />
                <StatCard value="50+" label="Genossenschaften" subtext="Partner network" />
                <StatCard value="24/7" label="AI Support" subtext="Always available" />
            </section>

            {/* Main Features Grid */}
            <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <FeatureCard
                    icon="🔍"
                    title="Smart Search"
                    description="Filter by district, price, size, and vibe. AI ranks listings by your success probability."
                    href="/search"
                    cta="Browse Listings"
                />
                <FeatureCard
                    icon="📊"
                    title="Application Tracker"
                    description="Track all your applications in one place. Never miss a viewing or response."
                    href="/tracker"
                    cta="View Dashboard"
                />
                <FeatureCard
                    icon="🧠"
                    title="Market Intelligence"
                    description="AI-powered price analysis, district trends, and success predictions."
                    href="/intelligence"
                    cta="Explore Insights"
                />
                <FeatureCard
                    icon="✉️"
                    title="AI Cover Letters"
                    description="Generate personalized cover letters in seconds. Stand out from the crowd."
                    href="/chat"
                    cta="Try AI Writer"
                />
                <FeatureCard
                    icon="🤝"
                    title="Genossenschaft Match"
                    description="Find housing cooperatives you're eligible for. Affordable, long-term homes."
                    href="/search?source=genossenschaft"
                    cta="Find Co-ops"
                />
                <FeatureCard
                    icon="💬"
                    title="24/7 Chat Assistant"
                    description="Get instant answers about documents, applications, and Berlin rental market."
                    href="/chat"
                    cta="Start Chatting"
                />
            </section>

            {/* How It Works */}
            <section className="ds-section">
                <h2 className="text-headline text-center text-on-background">How It Works</h2>
                <div className="mt-8 grid gap-6 md:grid-cols-4">
                    <StepCard
                        step="1"
                        title="Search"
                        description="Browse AI-curated listings matching your preferences"
                    />
                    <StepCard
                        step="2"
                        title="Analyze"
                        description="Get success probability and price insights for each listing"
                    />
                    <StepCard
                        step="3"
                        title="Apply"
                        description="Submit complete applications with AI-generated cover letters"
                    />
                    <StepCard
                        step="4"
                        title="Track"
                        description="Monitor all applications and viewings in one dashboard"
                    />
                </div>
            </section>

            {/* CTA Section */}
            <section className="rounded-3xl bg-gradient-to-r from-surface-low to-surface-high p-8 text-center md:p-12">
                <h2 className="text-headline text-on-background">Ready to find your home?</h2>
                <p className="mt-2 text-muted">
                    Join thousands of tenants who found their perfect home in Berlin
                </p>
                <div className="mt-8 flex justify-center gap-4">
                    <Link
                        href="/search"
                        className="btn-primary inline-flex items-center"
                    >
                        Start Free Search
                    </Link>
                    <Link
                        href="/intelligence"
                        className="btn-secondary inline-flex items-center"
                    >
                        Explore Market Data
                    </Link>
                </div>
            </section>
        </main>
    );
}

function StatCard({ value, label, subtext }: { value: string; label: string; subtext: string }) {
    return (
        <div className="ds-card p-6 text-center">
            <p className="text-3xl font-bold text-primary">{value}</p>
            <p className="mt-1 font-medium text-on-background">{label}</p>
            <p className="text-sm text-muted">{subtext}</p>
        </div>
    );
}

function FeatureCard({
    icon,
    title,
    description,
    href,
    cta,
}: {
    icon: string;
    title: string;
    description: string;
    href: string;
    cta: string;
}) {
    return (
        <div className="ds-card group p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-low text-2xl">
                {icon}
            </div>
            <h3 className="mt-4 text-title text-on-background">{title}</h3>
            <p className="mt-2 text-sm text-muted">{description}</p>
            <Link
                href={href}
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary transition hover:text-primary-hover"
            >
                {cta} →
            </Link>
        </div>
    );
}

function StepCard({ step, title, description }: { step: string; title: string; description: string }) {
    return (
        <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-white">
                {step}
            </div>
            <h3 className="mt-4 font-semibold text-on-background">{title}</h3>
            <p className="mt-2 text-sm text-muted">{description}</p>
        </div>
    );
}
