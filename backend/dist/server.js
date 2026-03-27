"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = require("./app");
const PORT = Number(process.env.PORT) || 3001;
const HOST = process.env.HOST ?? 'localhost';
async function main() {
    const app = await (0, app_1.buildApp)();
    await app.listen({ port: PORT, host: HOST });
}
// eslint-disable-next-line unicorn/prefer-top-level-await
main().catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    // eslint-disable-next-line n/no-process-exit, unicorn/no-process-exit
    process.exit(1);
});
