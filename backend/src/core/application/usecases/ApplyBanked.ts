import type { ComplianceRepo } from '../../ports/ComplianceRepo.js';
import type { BankingRepo } from '../../ports/BankingRepo.js';

export type ApplyInput = {
  shipId: string;
  year: number;   // apply to this deficit year
  amount: number; // must be > 0
};

export type ApplyResult = {
  shipId: string;
  year: number;
  cb_before: number;
  applied: number;
  cb_after: number;
  availableAfter: number;
};

export async function applyBanked(
  complianceRepo: ComplianceRepo,
  bankingRepo: BankingRepo,
  input: ApplyInput
): Promise<ApplyResult> {
  if (input.amount <= 0) throw new Error('Apply amount must be > 0.');

  const cb = await complianceRepo.getCB(input.shipId, input.year);
  if (!cb) throw new Error('No CB snapshot found for this ship/year.');

  const cb_before = cb.cb_gco2eq;
  if (cb_before >= 0) throw new Error('CB is not a deficit; nothing to apply.');

  const available = await bankingRepo.getAvailableBanked(input.shipId);
  if (available <= 0) throw new Error('No banked surplus available.');
  if (input.amount > available) throw new Error('Apply amount exceeds available banked.');

  // Cap apply to not overshoot positive (optional but aligns with rule "surplus ship cannot exit negative" analogue)
  const maxNeeded = Math.abs(cb_before);
  const applied = Math.min(input.amount, maxNeeded);

  // 1) record the application as a negative bank entry
  await bankingRepo.addBankEntry({
    ship_id: input.shipId,
    year: input.year,
    amount: -applied
  });

  // 2) update the compliance record (cb_after = cb_before + applied)
  const updated = await complianceRepo.upsertCB({
    ship_id: input.shipId,
    year: input.year,
    cb_gco2eq: cb_before + applied
  });

  const availableAfter = await bankingRepo.getAvailableBanked(input.shipId);

  return {
    shipId: input.shipId,
    year: input.year,
    cb_before,
    applied,
    cb_after: updated.cb_gco2eq,
    availableAfter
  };
}
