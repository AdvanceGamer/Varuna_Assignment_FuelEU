export type Route = {
  id: number;
  route_id: string;
  vessel_type: string;
  fuel_type: string;
  year: number;
  ghg_intensity: number;
  fuel_tons: number;
  distance_km: number;
  total_emissions: number;
  is_baseline: boolean;
};

export type ComparisonItem = {
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;
  percentDiff: number;
  compliant: boolean;
};

export type ComparisonResult = {
  baseline: { routeId: string; ghgIntensity: number } | null;
  items: ComparisonItem[];
};

export type CBResult = {
  shipId: string;
  year: number;
  energyMJ: number;
  targetIntensity: number;
  actualIntensity: number;
  cb_gco2eq: number;
  surplus: boolean;
};

export type BankRecord = {
  id?: number;
  ship_id: string;
  year: number;
  amount: number;
  created_at?: string;
};
