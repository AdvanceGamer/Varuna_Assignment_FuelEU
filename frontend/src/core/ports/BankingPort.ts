import type { BankRecord } from '../domain/types';

export interface BankingPort {
  records(params: { shipId: string; year?: number }): Promise<{ available: number; records: BankRecord[] }>;
  bank(body: { shipId: string; year: number; amount?: number }): Promise<{ shipId: string; year: number; banked: number; availableAfter: number }>;
  apply(body: { shipId: string; year: number; amount: number }): Promise<{ shipId: string; year: number; cb_before: number; applied: number; cb_after: number; availableAfter: number }>;
}
