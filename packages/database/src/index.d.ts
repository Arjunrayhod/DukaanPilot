export function getPrismaClient(): any;
export function checkDatabaseConnection(): Promise<{
  connected: boolean;
  provider: 'postgresql' | 'sqlite' | 'in-memory-fallback';
  latencyMs?: number;
  error?: string;
}>;
export const memoryStore: {
  users: Map<string, any>;
  shops: Map<string, any>;
  staff: Map<string, any>;
  categories: Map<string, any>;
  products: Map<string, any>;
  suppliers: Map<string, any>;
  stockMovements: any[];
  auditLogs: any[];
};
