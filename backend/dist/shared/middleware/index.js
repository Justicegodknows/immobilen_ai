"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sharedMiddleware = void 0;
const node_perf_hooks_1 = require("node:perf_hooks");
const requestStartTimes = new WeakMap();
const sharedMiddleware = (app, _options, done) => {
    app.addHook('onRequest', (request, reply, hookDone) => {
        if (!reply.hasHeader('x-request-id')) {
            reply.header('x-request-id', request.id);
        }
        requestStartTimes.set(request.raw, node_perf_hooks_1.performance.now());
        hookDone();
    });
    app.addHook('onSend', (request, reply, payload, hookDone) => {
        const start = requestStartTimes.get(request.raw);
        if (start !== undefined) {
            reply.header('x-response-time', `${(node_perf_hooks_1.performance.now() - start).toFixed(2)}ms`);
        }
        hookDone(null, payload);
    });
    done();
};
exports.sharedMiddleware = sharedMiddleware;
