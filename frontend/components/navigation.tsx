"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const APP_ENABLED = process.env.NEXT_PUBLIC_APP_ENABLED === "true";

export function Navigation() {
    const pathname = usePathname();
    if (!APP_ENABLED || pathname === "/" || pathname === "/onboarding") return null;

    const navItems = [
        { href: "/home", label: "Home" },
        { href: "/search", label: "Search" },
        { href: "/tracker", label: "Tracker" },
        { href: "/intelligence", label: "Intelligence" },
        { href: "/chat", label: "Chat" },
    ];

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname?.startsWith(href);
    };

    return (
        <nav className="fixed top-0 z-50 w-full h-16 border-b border-gray-200 bg-white">
            <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6 md:px-10">
                <Link
                    href="/"
                    className="text-lg font-bold tracking-tighter text-black"
                    title="Budenfinder home"
                >
                    Budenfinder
                </Link>

                <div className="hidden items-center gap-8 md:flex">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={
                                isActive(item.href)
                                    ? "relative text-sm font-medium text-black after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:bg-black"
                                    : "relative text-sm font-medium text-gray-500 transition-colors hover:text-black after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-black after:transition-all after:duration-200 hover:after:w-full"
                            }
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                <button
                    type="button"
                    className="rounded-md bg-black px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-900"
                >
                    Sign In
                </button>
            </div>
        </nav>
    );
}

export function MobileNav({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const pathname = usePathname();

    const navItems = [
        { href: "/home", label: "Home" },
        { href: "/search", label: "Search" },
        { href: "/tracker", label: "Tracker" },
        { href: "/intelligence", label: "Intelligence" },
        { href: "/chat", label: "Chat" },
    ];

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname?.startsWith(href);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 md:hidden" onClick={onClose}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div
                className="absolute right-0 top-0 h-full w-64 bg-white p-6 shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-6 flex items-center justify-between">
                    <span className="text-lg font-bold tracking-tighter text-black">Budenfinder</span>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1 text-gray-400 hover:text-black transition-colors"
                    >
                        ✕
                    </button>
                </div>
                <div className="flex flex-col gap-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            className={`px-3 py-2.5 text-sm font-medium transition-colors ${
                                isActive(item.href)
                                    ? "text-black font-semibold"
                                    : "text-gray-500 hover:text-black"
                            }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
                <div className="mt-6 border-t border-gray-100 pt-6">
                    <button
                        type="button"
                        className="w-full rounded-md bg-black px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-900"
                    >
                        Sign In
                    </button>
                </div>
            </div>
        </div>
    );
}
