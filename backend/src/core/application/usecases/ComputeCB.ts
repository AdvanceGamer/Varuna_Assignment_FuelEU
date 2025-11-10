import type { ComplianceRepo } from '../../ports/ComplianceRepo.js';
import { MJ_PER_TON_FUEL, TARGET_INTENSITY_2025 } from '../../../shared/constants.js';

export type ComputeCBInput = {
  shipId: string;
  year: number;
  actualIntensity: number; // gCO2e/MJ
  fuelTons: number;        // t
  targetIntensity?: number;
};

export type ComputeCBOutput = {
  shipId: string;
  year: number;
  energyMJ: number;
  targetIntensity: number;
  actualIntensity: number;
  cb_gco2eq: number; // positive => surplus, negative => deficit
};

export function computeEnergyMJ(fuelTons: number): number {
  return fuelTons * MJ_PER_TON_FUEL;
}

export function computeCBValue(target: number, actual: number, energyMJ: number): number {
  // CB = (Target - Actual) * Energy_in_scope
  return (target - actual) * energyMJ;
}

export async function computeAndStoreCB(
  repo: ComplianceRepo,
  input: ComputeCBInput
): Promise<ComputeCBOutput> {
  const target = input.targetIntensity ?? TARGET_INTENSITY_2025;
  const energyMJ = computeEnergyMJ(input.fuelTons);
  const cb = computeCBValue(target, input.actualIntensity, energyMJ);

  const saved = await repo.upsertCB({
    ship_id: input.shipId,
    year: input.year,
    cb_gco2eq: cb,
  });

  return {
    shipId: saved.ship_id,
    year: saved.year,
    energyMJ,
    targetIntensity: target,
    actualIntensity: input.actualIntensity,
    cb_gco2eq: saved.cb_gco2eq,
  };
}
