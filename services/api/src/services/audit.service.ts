import { logger } from '../utils/logger';

export interface AuditEntry {
  shopId?: string | null;
  userId?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  metadata?: Record<string, any>;
  ipAddress?: string | null;
}

export class AuditService {
  static async log(entry: AuditEntry): Promise<void> {
    const timestamp = new Date().toISOString();
    logger.info('AUDIT_EVENT', {
      ...entry,
      timestamp,
      audit: true,
    });
  }
}
