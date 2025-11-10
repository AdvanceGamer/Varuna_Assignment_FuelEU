import type { BankEntryRecord } from '../domain/entities.js';

export interface BankingRepo {
  getBankRecords(shipId: string, year?: number): Promise<BankEntryRecord[]>;
  getAvailableBanked(shipId: string): Promise<number>; // sum of banked - applied
  addBankEntry(entry: BankEntryRecord): Promise<BankEntryRecord>;
}
