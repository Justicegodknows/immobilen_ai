"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseEnv = parseEnv;
exports.paginate = paginate;
function parseEnv(key, fallback) {
    // eslint-disable-next-line security/detect-object-injection
    const value = process.env[key];
    if (value !== undefined)
        return value;
    if (fallback !== undefined)
        return fallback;
    throw new Error(`Missing required environment variable: ${key}`);
}
function paginate(page, limit) {
    return {
        skip: (page - 1) * limit,
        take: limit,
    };
}
