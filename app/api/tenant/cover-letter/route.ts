import { berlinListings, demoTenant } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const body = (await request.json()) as { listingId?: string };
    const listingId = body.listingId;

    if (!listingId) {
        return NextResponse.json(
            { error: "Missing required body field: listingId" },
            { status: 400 },
        );
    }

    const listing = berlinListings.find((item) => item.id === listingId);

    if (!listing) {
        return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    const letter = `Dear ${listing.landlordName},\n\nI am very interested in your apartment \"${listing.title}\" in ${listing.district}. I have a stable employment record (${demoTenant.stableEmploymentMonths} months), a monthly net income of EUR ${demoTenant.monthlyNetIncomeEur}, and complete application documents including SCHUFA.\n\nI appreciate the neighborhood profile and would be happy to introduce myself in a viewing.\n\nKind regards,\n${demoTenant.name}`;

    return NextResponse.json({
        listingId,
        landlord: listing.landlordName,
        letter,
    });
}
