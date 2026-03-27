"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDbRo = getDbRo;
const adapter_pg_1 = require("@prisma/adapter-pg");
const client_1 = require("@prisma/client");
const index_1 = require("../shared/utils/index");
let prismaRo;
function getDbRo() {
    if (prismaRo === undefined) {
        const adapter = new adapter_pg_1.PrismaPg({ connectionString: (0, index_1.parseEnv)('DATABASE_URL_RO') });
        prismaRo = new client_1.PrismaClient({
            adapter,
            log: process.env.NODE_ENV === 'development'
                ? ['query', 'warn', 'error']
                : ['warn', 'error'],
        });
        process.on('beforeExit', () => {
            void prismaRo?.$disconnect();
        });
    }
    return prismaRo;
}
