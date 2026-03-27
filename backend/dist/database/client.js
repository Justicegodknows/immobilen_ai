"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDb = getDb;
const adapter_pg_1 = require("@prisma/adapter-pg");
const client_1 = require("@prisma/client");
const index_1 = require("../shared/utils/index");
let prisma;
function getDb() {
    if (prisma === undefined) {
        const adapter = new adapter_pg_1.PrismaPg({ connectionString: (0, index_1.parseEnv)('DATABASE_URL') });
        prisma = new client_1.PrismaClient({
            adapter,
            log: process.env.NODE_ENV === 'development'
                ? ['query', 'warn', 'error']
                : ['warn', 'error'],
        });
        process.on('beforeExit', () => {
            void prisma?.$disconnect();
        });
    }
    return prisma;
}
