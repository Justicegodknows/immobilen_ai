"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const health_controller_1 = require("./health.controller");
const healthRoutes = (app, _options, done) => {
    app.get('/health', health_controller_1.getHealthHandler);
    done();
};
exports.default = healthRoutes;
