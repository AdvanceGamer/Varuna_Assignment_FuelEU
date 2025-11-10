import { prisma } from '../../../infrastructure/db/prisma.js';
import type { RouteRepo } from '../../../core/ports/RouteRepo.js';
import type { RouteEntity } from '../../../core/domain/entities.js';

export class RouteRepoPrisma implements RouteRepo {
  async listAll(): Promise<RouteEntity[]> {
    const rows = await prisma.route.findMany({ orderBy: { id: 'asc' } });
    return rows as unknown as RouteEntity[];
  }

  async getBaseline(): Promise<RouteEntity | null> {
    const row = await prisma.route.findFirst({ where: { is_baseline: true } });
    return row ? (row as unknown as RouteEntity) : null;
  }

  async setBaseline(id: number): Promise<void> {
    await prisma.$transaction([
      prisma.route.updateMany({ data: { is_baseline: false }, where: { is_baseline: true } }),
      prisma.route.update({ where: { id }, data: { is_baseline: true } }),
    ]);
  }
}
