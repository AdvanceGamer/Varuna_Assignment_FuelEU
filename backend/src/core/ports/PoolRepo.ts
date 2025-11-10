import type { PoolRecord, PoolMemberBeforeAfter } from '../domain/entities.js';

export interface PoolRepo {
  createPool(year: number, members: PoolMemberBeforeAfter[]): Promise<PoolRecord>;
}
