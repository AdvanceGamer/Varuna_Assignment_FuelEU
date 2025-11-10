import { prisma } from '../../../infrastructure/db/prisma.js';
import type { BankingRepo } from '../../../core/ports/BankingRepo.js';
import type { BankEntryRecord } from '../../../core/domain/entities.js';

export class BankingRepoPrisma implements BankingRepo {
  async getBankRecords(shipId: string, year?: number): Promise<BankEntryRecord[]> {
    const rows = await prisma.bankEntry.findMany({
      where: { ship_id: shipId, ...(year ? { year } : {}) },
      orderBy: { created_at: 'desc' }
    });
    return rows.map(r => ({
      id: r.id,
      ship_id: r.ship_id,
      year: r.year,
      amount: r.amount,
      created_at: r.created_at
    }));
  }

  async getAvailableBanked(shipId: string): Promise<number> {
    const agg = await prisma.bankEntry.aggregate({
      _sum: { amount: true },
      where: { ship_id: shipId }
    });
    return agg._sum.amount ?? 0;
  }

  async addBankEntry(entry: BankEntryRecord): Promise<BankEntryRecord> {
    const row = await prisma.bankEntry.create({
      data: {
        ship_id: entry.ship_id,
        year: entry.year,
        amount: entry.amount
      }
    });
    return {
      id: row.id,
      ship_id: row.ship_id,
      year: row.year,
      amount: row.amount,
      created_at: row.created_at
    };
  }
}
