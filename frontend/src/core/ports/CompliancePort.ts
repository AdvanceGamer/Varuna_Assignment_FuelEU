import type { CBResult } from '../domain/types';

export interface CompliancePort {
  computeCB(params: { shipId: string; year: number; intensity: number; fuelTons: number }): Promise<CBResult>;
}
