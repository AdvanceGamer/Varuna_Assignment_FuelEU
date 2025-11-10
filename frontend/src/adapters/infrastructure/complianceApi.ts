import { api } from './apiClient';
import type { CompliancePort } from '../../core/ports/CompliancePort';
import type { CBResult } from '../../core/domain/types';

export const complianceApi: CompliancePort = {
  computeCB: ({ shipId, year, intensity, fuelTons }) =>
    api.get<CBResult>(`/compliance/cb?shipId=${encodeURIComponent(shipId)}&year=${year}&intensity=${intensity}&fuelTons=${fuelTons}`)
};
