"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHealthHandler = getHealthHandler;
const health_service_1 = require("../../features/health/health.service");
async function getHealthHandler(_req, reply) {
    const status = (0, health_service_1.checkHealth)();
    await reply.send(status);
}
