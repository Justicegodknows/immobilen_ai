import {
    GenossenschaftMatch,
    Listing,
    PriceAssessment,
    SuccessProbability,
    TenantProfile,
    TenantScoreBreakdown,
} from "@/lib/types";

function getRent(listing: Listing): number {
    return Number(listing.warmRentAmount ?? listing.coldRentAmount ?? 0);
}

function getArea(listing: Listing): number {
    return Number(listing.areaM2 ?? 0);
}

export function assessPrice(listing: Listing): PriceAssessment {
    const rent = getRent(listing);
    const area = getArea(listing);
    const baselinePerM2 = 18; // Berlin average fallback
    const expectedRentEur = Math.round(baselinePerM2 * area);
    const deltaEur = rent - expectedRentEur;

    return {
        listingId: listing.id,
        expectedRentEur,
        deltaEur,
        isOverpriced: deltaEur > 120,
        confidence: 0.71,
    };
}

// Alias for backwards compatibility
export const calculatePriceAssessment = assessPrice;

export function calculateTenantScore(
    tenant: TenantProfile,
    listing: Listing,
): TenantScoreBreakdown {
    const rent = getRent(listing);
    const incomeCoverage = tenant.monthlyNetIncomeEur / Math.max(rent, 1);
    const incomeStability = Math.min(40, Math.round(incomeCoverage * 12));

    const documentCompleteness = tenant.hasSchufa ? 30 : 10;

    let householdFit = 10;
    if (tenant.householdSize <= 2 && (listing.rooms ?? 0) >= 2) householdFit += 10;
    if (listing.city && tenant.preferredDistricts.includes(listing.city)) householdFit += 10;

    const total = Math.min(100, incomeStability + documentCompleteness + householdFit);

    const notes: string[] = [];
    if (!tenant.hasSchufa) notes.push("Missing SCHUFA reduces application competitiveness.");
    if (!listing.city || !tenant.preferredDistricts.includes(listing.city)) {
        notes.push("Location mismatch lowers preference fit.");
    }
    if (incomeCoverage < 2.7) {
        notes.push("Income-to-rent ratio is below the ideal threshold.");
    }

    return {
        total,
        incomeStability,
        documentCompleteness,
        householdFit,
        notes,
    };
}

export function estimateSuccessProbability(
    tenantScore: TenantScoreBreakdown,
    listing: Listing,
): SuccessProbability {
    let probability = tenantScore.total * 0.78;

    const bounded = Math.max(5, Math.min(95, Math.round(probability)));
    const reasons = [
        `Tenant profile score contributes ${Math.round(tenantScore.total * 0.7)} points.`,
        `Source: ${listing.source}.`,
    ];

    return {
        listingId: listing.id,
        probability: bounded,
        reasons,
    };
}

export function matchGenossenschaft(
    tenant: TenantProfile,
    listing: Listing,
): GenossenschaftMatch | null {
    // Genossenschaft matching not available from backend scraper data
    return null;
}
