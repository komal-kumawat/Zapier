import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL, // make sure ! is used if TS strict mode
});
const prismaclient = new PrismaClient({
    adapter, // pass the adapter
    log: ['query', 'warn', 'error'], // optional but useful
});
export default prismaclient;
