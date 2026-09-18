/**
 * DukaanPilot - Database Layer with Prisma & Robust Connection Management
 */

let prismaClient = null;

function getPrismaClient() {
  if (!prismaClient) {
    try {
      const { PrismaClient } = require('@prisma/client');
      prismaClient = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      });
    } catch (err) {
      console.warn('PrismaClient not yet generated or DB unavailable. Using in-memory adapter mode.');
    }
  }
  return prismaClient;
}

// In-memory mock store for local self-contained tests without live Postgres connection
const memoryStore = {
  users: new Map(),
  shops: new Map(),
  staff: new Map(),
  auditLogs: []
};

async function checkDatabaseConnection() {
  const start = Date.now();
  const client = getPrismaClient();
  if (client) {
    try {
      await client.$queryRaw`SELECT 1`;
      return {
        connected: true,
        provider: 'postgresql',
        latencyMs: Date.now() - start
      };
    } catch (err) {
      return {
        connected: false,
        provider: 'postgresql',
        error: err.message,
        latencyMs: Date.now() - start
      };
    }
  }
  return {
    connected: true,
    provider: 'in-memory-fallback',
    latencyMs: 1
  };
}

module.exports = {
  getPrismaClient,
  checkDatabaseConnection,
  memoryStore
};
