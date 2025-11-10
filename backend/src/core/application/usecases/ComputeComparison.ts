// core/application/usecases/ComputeComparison.ts
import type { RouteRepo } from '../../ports/RouteRepo.js';
import type { RouteEntity } from '../../domain/entities.js';
import { TARGET_INTENSITY_2025 } from '../../../shared/constants.js';

export type ComparisonItem = {
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;    // comparison route intensity
  percentDiff: number;     // ((comparison / baseline) - 1) * 100
  compliant: boolean;      // comparison route compliant vs target
};

export type ComparisonResult = {
  baseline: {
    routeId: string;
    ghgIntensity: number;
  } | null;
  items: ComparisonItem[];
};

function percentDiff(comparison: number, baseline: number): number {
  if (baseline === 0) return 0;
  return ((comparison / baseline) - 1) * 100;
}

function isCompliant(actualIntensity: number, target = TARGET_INTENSITY_2025): boolean {
  return actualIntensity <= target;
}

export async function computeRoutesComparison(routeRepo: RouteRepo): Promise<ComparisonResult> {
  const [baseline, all] = await Promise.all([
    routeRepo.getBaseline(),
    routeRepo.listAll(),
  ]);

  if (!baseline) {
    return { baseline: null, items: [] };
  }

  const b = baseline.ghg_intensity;

  const items: ComparisonItem[] = all
    .filter((r) => r.id !== baseline.id)
    .map((r: RouteEntity) => ({
      routeId: r.route_id,
      vesselType: r.vessel_type,
      fuelType: r.fuel_type,
      year: r.year,
      ghgIntensity: r.ghg_intensity,
      percentDiff: Number(percentDiff(r.ghg_intensity, b).toFixed(4)),
      compliant: isCompliant(r.ghg_intensity),
    }));

  return {
    baseline: { routeId: baseline.route_id, ghgIntensity: b },
    items,
  };
}
