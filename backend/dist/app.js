"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildApp = buildApp;
const fastify_1 = __importDefault(require("fastify"));
const health_routes_1 = __importDefault(require("./api/health/health.routes"));
const index_1 = require("./shared/middleware/index");
async function buildApp() {
    const app = (0, fastify_1.default)({ logger: true });
    // Cross-cutting middleware: request ID, response time
    app.register(index_1.sharedMiddleware);
    // API routes — each resource is registered under its own prefix
    await app.register(health_routes_1.default);
    // Future: await app.register(propertyRoutes, { prefix: '/api/v1/properties' })
    return app;
}
