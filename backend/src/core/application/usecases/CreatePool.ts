import type { ComplianceRepo } from '../../ports/ComplianceRepo.js';
import type { PoolRepo } from '../../ports/PoolRepo.js';
import type { PoolMemberBeforeAfter } from '../../domain/entities.js';

export type CreatePoolInput = {
  year: number;
  members: { shipId: string }[]; // pool members by shipId for that year
};

export type CreatePoolOutput = {
  poolId: number;
  year: number;
  poolSumBefore: number;
  poolSumAfter: number;
  members: PoolMemberBeforeAfter[];
};

export async function createPool(
  complianceRepo: ComplianceRepo,
  poolRepo: PoolRepo,
  input: CreatePoolInput
): Promise<CreatePoolOutput> {
  // 1) Load CB snapshots for all ships in the requested year
  const before: PoolMemberBeforeAfter[] = [];
  for (const m of input.members) {
    const rec = await complianceRepo.getCB(m.shipId, input.year);
    if (!rec) {
      throw new Error(`No CB snapshot for shipId=${m.shipId} year=${input.year}`);
    }
    before.push({ ship_id: rec.ship_id, cb_before: rec.cb_gco2eq, cb_after: rec.cb_gco2eq });
  }

  // 2) Rule: Sum(adjustedCB) ≥ 0  (sum before == sum after when only transferring)
  const poolSumBefore = before.reduce((s, x) => s + x.cb_before, 0);
  if (poolSumBefore < 0) {
    throw new Error(`Pool sum must be ≥ 0. Current sum: ${poolSumBefore}`);
  }

  // 3) Greedy allocation: sort positives desc and negatives asc
  const positives = before
    .filter(m => m.cb_before > 0)
    .sort((a, b) => b.cb_before - a.cb_before);
  const negatives = before
    .filter(m => m.cb_before < 0)
    .sort((a, b) => a.cb_before - b.cb_before); // most negative first

  let pi = 0; // index for positives
  for (const def of negatives) {
    let need = -def.cb_after; // positive amount needed to reach 0
    while (need > 0 && pi < positives.length) {
      const sup = positives[pi];
      if (!sup) break;
      if (sup.cb_after <= 0) { pi++; continue; }
      const transfer = Math.min(need, sup.cb_after);
      // transfer from surplus to deficit
      sup.cb_after -= transfer;
      def.cb_after += transfer;
      need -= transfer;
      if (sup.cb_after <= 0) pi++;
    }
    // If we run out of surplus, the deficit remains (allowed only if poolSumBefore==0 and we exhausted all)
    // But spec requires total ≥ 0 so all deficits can be zeroed-out.
  }

  // 4) Rule checks:
  // - Deficit ship cannot exit worse (we only increased cb_after for deficits) ✔
  // - Surplus ship cannot exit negative (we capped at available surplus) ✔
  // - Pool sum unchanged
  const poolSumAfter = before.reduce((s, x) => s + x.cb_after, 0);

  // 5) Persist pool + members
  const saved = await poolRepo.createPool(input.year, before);

  return {
    poolId: saved.id!,
    year: saved.year,
    poolSumBefore,
    poolSumAfter,
    members: before
  };
}
