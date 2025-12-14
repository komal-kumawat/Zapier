import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
declare const prismaclient: PrismaClient<{
    adapter: PrismaPg;
    log: ("error" | "query" | "warn")[];
}, "error" | "query" | "warn", import("@prisma/client/runtime/client").DefaultArgs>;
export default prismaclient;
