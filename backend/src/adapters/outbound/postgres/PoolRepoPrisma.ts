import { prisma } from '../../../infrastructure/db/prisma.js';
import type { PoolRepo } from '../../../core/ports/PoolRepo.js';
import type { PoolRecord, PoolMemberBeforeAfter } from '../../../core/domain/entities.js';

export class PoolRepoPrisma implements PoolRepo {
  async createPool(year: number, members: PoolMemberBeforeAfter[]): Promise<PoolRecord> {
    const created = await prisma.pool.create({
      data: {
        year,
        members: {
          create: members.map(m => ({
            ship_id: m.ship_id,
            cb_before: m.cb_before,
            cb_after: m.cb_after
          }))
        }
      },
      include: { members: true }
    });

    return {
      id: created.id,
      year: created.year,
      created_at: created.created_at,
      members: created.members.map(m => ({
        ship_id: m.ship_id,
        cb_before: m.cb_before,
        cb_after: m.cb_after
      }))
    };
    }
}
