import { api } from './apiClient';
import type { Route, ComparisonResult } from '../../core/domain/types';
import type { RoutesPort } from '../../core/ports/RoutesPort';

export const routesApi: RoutesPort = {
  list: () => api.get<Route[]>('/routes'),
  setBaseline: (id: number) => api.post<{ ok: true }>(`/routes/${id}/baseline`,{}).then(() => {}),
  comparison: () => api.get<ComparisonResult>('/routes/comparison'),
};
