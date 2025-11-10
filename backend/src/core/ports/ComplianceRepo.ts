import type { ShipComplianceRecord } from '../domain/entities.js';

export interface ComplianceRepo {
  upsertCB(record: ShipComplianceRecord): Promise<ShipComplianceRecord>;
  getCB(shipId: string, year: number): Promise<ShipComplianceRecord | null>;
}
