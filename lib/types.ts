export type ListingSource =
    | "immobilienscout24"
    | "immowelt"
    | "kleinanzeigen"
    | "genossenschaft";

export type Listing = {
    id: string;
    title: string;
    district: string;
    address: string;
    monthlyRentEur: number;
    sizeM2: number;
    rooms: number;
    source: ListingSource;
    genossenschaftName?: string;
    landlordName: string;
    commuteMinutesToCenter: number;
    noiseScore: number;
    vibeTags: string[];
};

export type TenantProfile = {
    name: string;
    email: string;
    monthlyNetIncomeEur: number;
    householdSize: number;
    hasPets: boolean;
    hasSchufa: boolean;
    stableEmploymentMonths: number;
    preferredDistricts: string[];
};

export type PriceAssessment = {
    listingId: string;
    expectedRentEur: number;
    deltaEur: number;
    isOverpriced: boolean;
    confidence: number;
};

export type TenantScoreBreakdown = {
    total: number;
    incomeStability: number;
    documentCompleteness: number;
    householdFit: number;
    notes: string[];
};

export type SuccessProbability = {
    listingId: string;
    probability: number;
    reasons: string[];
};

export type GenossenschaftMatch = {
    listingId: string;
    genossenschaftName: string;
    isEligible: boolean;
    eligibilityReasons: string[];
    handoffUrl: string;
};
