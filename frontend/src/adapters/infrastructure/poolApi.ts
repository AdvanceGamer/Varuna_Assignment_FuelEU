import { api } from './apiClient';
import type { PoolPort } from '../../core/ports/PoolPort';

export const poolApi: PoolPort = {
  create: (body) => api.post(`/pools`, body),
};
