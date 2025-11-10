import { prisma } from '../../../infrastructure/db/prisma.js';
import type { ComplianceRepo } from '../../../core/ports/ComplianceRepo.js';
import type { ShipComplianceRecord } from '../../../core/domain/entities.js';

export class ComplianceRepoPrisma implements ComplianceRepo {
  async upsertCB(rec: ShipComplianceRecord): Promise<ShipComplianceRecord> {
    const row = await prisma.shipCompliance.upsert({
      where: {
        ship_id_year: {
          ship_id: rec.ship_id,
          year: rec.year,
        },
      },
      update: { cb_gco2eq: rec.cb_gco2eq },
      create: { ship_id: rec.ship_id, year: rec.year, cb_gco2eq: rec.cb_gco2eq },
    });
    return {
      id: row.id,
      ship_id: row.ship_id,
      year: row.year,
      cb_gco2eq: row.cb_gco2eq,
    };
  }

  async getCB(shipId: string, year: number): Promise<ShipComplianceRecord | null> {
    const row = await prisma.shipCompliance.findFirst({
      where: { ship_id: shipId, year },
    });
    if (!row) return null;
    return { id: row.id, ship_id: row.ship_id, year: row.year, cb_gco2eq: row.cb_gco2eq };
  }
}
