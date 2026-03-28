import 'dotenv/config';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { buildApp } from '../app';

let app: FastifyInstance;

beforeAll(async () => {
    app = await buildApp();
    await app.ready();
});

afterAll(async () => {
    await app.close();
});

// ── Health ────────────────────────────────────────────────────────────────────

describe('GET /health', () => {
    it('returns 200 with status ok', async () => {
        const res = await app.inject({ method: 'GET', url: '/health' });

        expect(res.statusCode).toBe(200);

        const body = res.json();
        expect(body).toMatchObject({
            status: 'ok',
            timestamp: expect.any(String),
            version: expect.any(String),
        });
    });
});

// ── Middleware ─────────────────────────────────────────────────────────────────

describe('shared middleware', () => {
    it('sets x-request-id header', async () => {
        const res = await app.inject({ method: 'GET', url: '/health' });
        const value = res.headers['x-request-id'] ?? res.headers['X-Request-Id'];
        expect(value).toBeDefined();
    });

    it('sets x-response-time header', async () => {
        const res = await app.inject({ method: 'GET', url: '/health' });
        const value = (res.headers['x-response-time'] ?? res.headers['X-Response-Time']) as string | undefined;
        expect(value).toBeDefined();
        expect(value).toMatch(/^\d+\.\d+ms$/);
    });
});

// ── Listings ──────────────────────────────────────────────────────────────────

describe('GET /api/v1/listings', () => {
    it('returns 200 with paginated data', async () => {
        const res = await app.inject({ method: 'GET', url: '/api/v1/listings' });

        expect(res.statusCode).toBe(200);

        const body = res.json();
        expect(body).toHaveProperty('data');
        expect(body).toHaveProperty('meta');
        expect(Array.isArray(body.data)).toBe(true);
        expect(body.meta).toMatchObject({
            page: 1,
            limit: 20,
            total: expect.any(Number),
        });
    });

    it('respects page and limit query params', async () => {
        const res = await app.inject({
            method: 'GET',
            url: '/api/v1/listings?page=1&limit=2',
        });

        expect(res.statusCode).toBe(200);

        const body = res.json();
        expect(body.meta.limit).toBe(2);
        expect(body.data.length).toBeLessThanOrEqual(2);
    });

    it('returns 400 for invalid query params', async () => {
        const res = await app.inject({
            method: 'GET',
            url: '/api/v1/listings?page=-1',
        });

        expect(res.statusCode).toBe(400);
        expect(res.json()).toHaveProperty('error');
    });
});

describe('GET /api/v1/listings/:id', () => {
    it('returns 404 for a non-existent listing', async () => {
        const res = await app.inject({
            method: 'GET',
            url: '/api/v1/listings/non-existent-id',
        });

        expect(res.statusCode).toBe(404);
        expect(res.json()).toEqual({ error: 'Listing not found' });
    });
});

// ── Scrapers ──────────────────────────────────────────────────────────────────

describe('GET /api/v1/scrapers/jobs', () => {
    it('returns 200 with job list', async () => {
        const res = await app.inject({ method: 'GET', url: '/api/v1/scrapers/jobs' });

        expect(res.statusCode).toBe(200);

        const body = res.json();
        expect(body).toHaveProperty('data');
        expect(Array.isArray(body.data)).toBe(true);
    });
});

describe('POST /api/v1/scrapers/:sourceId/run', () => {
    it('returns 404 for unknown scraper', async () => {
        const res = await app.inject({
            method: 'POST',
            url: '/api/v1/scrapers/does-not-exist/run',
        });

        expect(res.statusCode).toBe(404);
        expect(res.json()).toEqual({ error: "Scraper 'does-not-exist' not found" });
    });
});

// ── 404 fallback ──────────────────────────────────────────────────────────────

describe('unknown routes', () => {
    it('returns 404 for non-existent paths', async () => {
        const res = await app.inject({ method: 'GET', url: '/no-such-route' });
        expect(res.statusCode).toBe(404);
    });
});
