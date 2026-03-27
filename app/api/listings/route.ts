import { berlinListings } from "@/lib/data";
import { assessPrice } from "@/lib/scoring";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const district = request.nextUrl.searchParams.get("district")?.toLowerCase();
    const source = request.nextUrl.searchParams.get("source")?.toLowerCase();
    const maxRentRaw = request.nextUrl.searchParams.get("maxRent");
    const maxRent = maxRentRaw ? Number(maxRentRaw) : undefined;

    const listings = berlinListings
        .filter((listing) => {
            if (district && listing.district.toLowerCase() !== district) return false;
            if (source && listing.source.toLowerCase() !== source) return false;
            if (maxRent !== undefined && listing.monthlyRentEur > maxRent) return false;
            return true;
        })
        .map((listing) => ({
            ...listing,
            priceAssessment: assessPrice(listing),
        }));

    return NextResponse.json({
        count: listings.length,
        listings,
    });
}
