import { api } from './apiClient';
import type { BankingPort } from '../../core/ports/BankingPort';
import type { BankRecord } from '../../core/domain/types';

export const bankingApi: BankingPort = {
  records: ({ shipId, year }) =>
    api.get<{ available: number; records: BankRecord[] }>(
      `/banking/records?shipId=${encodeURIComponent(shipId)}${year ? `&year=${year}` : ''}`
    ),
  bank:  (body) => api.post(`/banking/bank`, body),
  apply: (body) => api.post(`/banking/apply`, body),
};
