import { LeaveWaitlistClient } from "./leave-waitlist-client";
import Link from "next/link";

type Props = {
    searchParams: Promise<{ email?: string }>;
};

export default async function LeaveWaitlistPage({ searchParams }: Props) {
    const { email } = await searchParams;

    if (!email || !email.trim()) {
        return (
            <>
                <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-gray-200 bg-white">
                    <div className="mx-auto flex h-full max-w-6xl items-center px-6 md:px-10">
                        <Link href="/" className="text-lg font-bold tracking-tighter text-black">
                            Budenfinder
                        </Link>
                    </div>
                </header>
                <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 pt-16">
                    <div className="w-full max-w-md text-center">
                        <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-gray-400">
                            Invalid Link
                        </p>
                        <h1 className="text-4xl font-black tracking-tight text-black md:text-5xl">
                            No email
                            <br />
                            provided.
                        </h1>
                        <p className="mt-4 text-base leading-relaxed text-gray-500">
                            This link is invalid. Use the link from your signup confirmation to leave the waitlist.
                        </p>
                        <div className="mt-10">
                            <Link
                                href="/"
                                className="inline-block rounded-md bg-black px-8 py-4 font-bold text-white transition-colors hover:bg-gray-900"
                            >
                                Back to homepage
                            </Link>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    return <LeaveWaitlistClient email={email.trim()} />;
}
