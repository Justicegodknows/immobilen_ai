import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export async function GET(request: NextRequest) {
    const params = request.nextUrl.searchParams.toString();
    const upstream = await fetch(`${BACKEND_URL}/api/v1/listings?${params}`);
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
}
