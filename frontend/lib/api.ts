import type { Listing, ListingsQuery, ListingsResponse } from "./types";

const BASE = "/api/v1";

function toSearchParams(query: ListingsQuery): URLSearchParams {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
        if (value !== undefined && value !== "" && value !== null) {
            params.set(key, String(value));
        }
    }
    return params;
}

export async function getListings(
    query: ListingsQuery = {},
): Promise<ListingsResponse> {
    const params = toSearchParams(query);
    const res = await fetch(`${BASE}/listings?${params.toString()}`);
    if (!res.ok) throw new Error(`Failed to fetch listings: ${res.status}`);
    return res.json() as Promise<ListingsResponse>;
}

export async function getListingById(
    id: string,
): Promise<Listing> {
    const res = await fetch(`${BASE}/listings/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error(`Failed to fetch listing ${id}: ${res.status}`);
    const body = (await res.json()) as { data: Listing };
    return body.data;
}
