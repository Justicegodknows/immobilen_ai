"use client";

import { usePathname } from "next/navigation";

export function MainContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    return (
        <div className={`flex min-h-0 w-full flex-1 flex-col${pathname === "/" || pathname === "/onboarding" ? "" : " pt-20"}`}>
            {children}
        </div>
    );
}
