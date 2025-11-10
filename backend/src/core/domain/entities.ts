export type RouteEntity = {
  id: number;
  route_id: string;
  vessel_type: string;
  fuel_type: string;
  year: number;
  ghg_intensity: number;   // gCO2e/MJ
  fuel_tons: number;       // t
  distance_km: number;
  total_emissions: number; // t
  is_baseline: boolean;
};

export type ShipComplianceRecord = {
  id?: number;
  ship_id: string;
  year: number;
  cb_gco2eq: number;
};

export type BankEntryRecord = {
  id?: number;
  ship_id: string;
  year: number;
  amount: number;      // +ve = banked; -ve = applied
  created_at?: Date;
};

export type PoolMemberBeforeAfter = {
  ship_id: string;
  cb_before: number;
  cb_after: number;
};

export type PoolRecord = {
  id?: number;
  year: number;
  created_at?: Date;
  members: PoolMemberBeforeAfter[];
};
