import type { Listing } from "./types";

export type FilterWeight = 1 | 2 | 3 | 4 | 5;

export type WeightedDimension<T> = {
    value: T;
    weight: FilterWeight;
    enabled: boolean;
};

export type SmartFeedFilter = {
    maxRent: WeightedDimension<number>;
    minRooms: WeightedDimension<number>;
    minAreaM2: WeightedDimension<number>;
    districts: WeightedDimension<string[]>;
    wbsOnly: WeightedDimension<boolean>;
};

export const DEFAULT_SMART_FEED: SmartFeedFilter = {
    maxRent:   { value: 1200, weight: 4, enabled: true  },
    minRooms:  { value: 2,    weight: 3, enabled: true  },
    minAreaM2: { value: 50,   weight: 2, enabled: true  },
    districts: { value: [],   weight: 2, enabled: false },
    wbsOnly:   { value: false, weight: 1, enabled: false },
};

export const SMART_FEED_LS_KEY = "budenfinder.smartFeed";

/**
 * Score a listing against weighted filter preferences.
 * Each enabled dimension produces a partial score in [0, 1].
 * Scores are weighted, summed, normalised, and returned as 0–100.
 */
export function scoreListing(listing: Listing, filters: SmartFeedFilter): number {
    let weightedSum = 0;
    let totalWeight = 0;

    // Rent score: 1.0 at or below target, linear decay to 0 at +20% above
    if (filters.maxRent.enabled) {
        const rent = listing.warmRentAmount ?? listing.coldRentAmount;
        let rentScore = 0;
        if (rent !== null) {
            const target = filters.maxRent.value;
            if (rent <= target) {
                rentScore = 1.0;
            } else {
                const overshoot = rent - target;
                rentScore = Math.max(0, 1 - (overshoot / target) * 5);
            }
        }
        weightedSum += rentScore * filters.maxRent.weight;
        totalWeight += filters.maxRent.weight;
    }

    // Rooms score: 1.0 if meets target, 0.5 if one short, 0 if two+ short
    if (filters.minRooms.enabled) {
        const rooms = listing.rooms;
        let roomsScore = 0;
        if (rooms !== null) {
            const diff = Math.floor(rooms) - filters.minRooms.value;
            if (diff >= 0) {
                roomsScore = 1.0;
            } else if (diff === -1) {
                roomsScore = 0.5;
            }
        }
        weightedSum += roomsScore * filters.minRooms.weight;
        totalWeight += filters.minRooms.weight;
    }

    // Area score: 1.0 at or above target, linear within 15m² below, 0 beyond
    if (filters.minAreaM2.enabled) {
        const area = listing.areaM2;
        let areaScore = 0;
        if (area !== null) {
            const target = filters.minAreaM2.value;
            if (area >= target) {
                areaScore = 1.0;
            } else if (area >= target - 15) {
                areaScore = area / target;
            }
        }
        weightedSum += areaScore * filters.minAreaM2.weight;
        totalWeight += filters.minAreaM2.weight;
    }

    // Districts score: 1.0 if match, 0.5 neutral if empty list or null city
    if (filters.districts.enabled && filters.districts.value.length > 0) {
        const city = listing.city?.toLowerCase() ?? "";
        const match = filters.districts.value.some(
            (d) => city.includes(d.toLowerCase().trim()) || d.toLowerCase().trim().includes(city),
        );
        const districtScore = city ? (match ? 1.0 : 0.0) : 0.5;
        weightedSum += districtScore * filters.districts.weight;
        totalWeight += filters.districts.weight;
    }

    // WBS score: only active when wbsOnly is true — penalises non-WBS listings
    if (filters.wbsOnly.enabled && filters.wbsOnly.value) {
        const wbsScore = listing.isWBSRequired === true ? 1.0 : 0.0;
        weightedSum += wbsScore * filters.wbsOnly.weight;
        totalWeight += filters.wbsOnly.weight;
    }

    if (totalWeight === 0) return 50; // neutral score when nothing is enabled
    return Math.round((weightedSum / totalWeight) * 100);
}

export function loadSmartFeedFilter(): SmartFeedFilter {
    try {
        const raw = localStorage.getItem(SMART_FEED_LS_KEY);
        if (!raw) return DEFAULT_SMART_FEED;
        const stored = JSON.parse(raw) as Partial<SmartFeedFilter>;
        return {
            maxRent:   { ...DEFAULT_SMART_FEED.maxRent,   ...(stored.maxRent   ?? {}) },
            minRooms:  { ...DEFAULT_SMART_FEED.minRooms,  ...(stored.minRooms  ?? {}) },
            minAreaM2: { ...DEFAULT_SMART_FEED.minAreaM2, ...(stored.minAreaM2 ?? {}) },
            districts: { ...DEFAULT_SMART_FEED.districts, ...(stored.districts ?? {}) },
            wbsOnly:   { ...DEFAULT_SMART_FEED.wbsOnly,   ...(stored.wbsOnly   ?? {}) },
        };
    } catch {
        return DEFAULT_SMART_FEED;
    }
}

export function saveSmartFeedFilter(f: SmartFeedFilter): void {
    try {
        localStorage.setItem(SMART_FEED_LS_KEY, JSON.stringify(f));
    } catch {
        // ignore storage errors
    }
}
