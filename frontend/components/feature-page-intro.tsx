"use client";

import React from "react";

type FeaturePageIntroProps = {
    eyebrow: string;
    title: string;
    description: string;
    howItWorks: string[];
    videoTitle?: string;
    videoSrc?: string;
};

/**
 * Map each page eyebrow to its matching video in /public.
 * Next.js serves files in /public from the root path.
 */
const VIDEO_MAP: Record<string, string> = {
    "Search": "/kling_20260328_作品_A_sleek__d_5287_0.mp4",
    "Market Intelligence": "/PixVerse_V5.6_Image_Text_720P_Prompt_An_animat.mp4",
    "AI Assistant": "/PixVerse_V5.6_Image_Text_720P_A_minimalist_dar.mp4",
    "Application Tracker": "/kling_20260328_作品_A_sleek__d_5287_0.mp4",
};

export function FeaturePageIntro({
    eyebrow,
    title,
    description,
    howItWorks,
    videoTitle = "Feature preview",
    videoSrc,
}: FeaturePageIntroProps) {
    const resolvedSrc = videoSrc ?? VIDEO_MAP[eyebrow];

    return (
        <section className="rounded-2xl bg-surface-container-lowest p-6 shadow-ambient md:p-8">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
            <h1 className="mt-2 font-sans text-2xl font-bold tracking-tight text-on-background md:text-3xl">
                {title}
            </h1>
            <p className="mt-3 max-w-3xl font-sans text-sm leading-relaxed text-on-surface/90 md:text-base">
                {description}
            </p>
            <div className="mt-6 rounded-2xl bg-surface-container-low px-5 py-5">
                <p className="font-mono text-xs font-semibold uppercase tracking-wider text-secondary">
                    How it works
                </p>
                <ol className="mt-3 list-decimal space-y-2.5 pl-5 font-sans text-sm leading-relaxed text-on-background">
                    {howItWorks.map((line) => (
                        <li key={line}>{line}</li>
                    ))}
                </ol>
            </div>
            <div className="mt-8">
                <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-wider text-on-background/70">
                    {videoTitle}
                </p>
                {resolvedSrc ? (
                    <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-outline-variant/20 shadow-inner">
                        <video
                            className="aspect-video w-full rounded-2xl object-cover"
                            src={resolvedSrc}
                            autoPlay
                            loop
                            muted
                            playsInline
                        />
                    </div>
                ) : (
                    <div className="flex aspect-video w-full max-w-3xl items-center justify-center rounded-2xl border border-outline-variant/20 bg-surface-container-low shadow-inner">
                        <div className="flex flex-col items-center gap-4 text-on-surface/50">
                            <span className="material-symbols-outlined text-[40px] animate-pulse">auto_awesome</span>
                            <p className="font-mono text-sm uppercase tracking-wider text-on-surface/40">Preview coming soon</p>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
