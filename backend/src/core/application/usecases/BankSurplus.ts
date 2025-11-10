import type { ComplianceRepo } from '../../ports/ComplianceRepo.js';
import type { BankingRepo } from '../../ports/BankingRepo.js';

export type BankInput = {
  shipId: string;
  year: number;
  amount?: number; // optional: default is full positive CB
};

export type BankResult = {
  shipId: string;
  year: number;
  banked: number;
  availableAfter: number;
};

export async function bankSurplus(
  complianceRepo: ComplianceRepo,
  bankingRepo: BankingRepo,
  input: BankInput
): Promise<BankResult> {
  const cb = await complianceRepo.getCB(input.shipId, input.year);
  if (!cb) throw new Error('No CB snapshot found for this ship/year.');
  if (cb.cb_gco2eq <= 0) throw new Error('CB is not positive; nothing to bank.');

  const toBank = input.amount ?? cb.cb_gco2eq;
  if (toBank <= 0) throw new Error('Bank amount must be > 0.');
  if (toBank > cb.cb_gco2eq) throw new Error('Bank amount exceeds available CB.');

  await bankingRepo.addBankEntry({
    ship_id: input.shipId,
    year: input.year,
    amount: toBank // positive
  });

  const availableAfter = await bankingRepo.getAvailableBanked(input.shipId);

  return {
    shipId: input.shipId,
    year: input.year,
    banked: toBank,
    availableAfter
  };
}
