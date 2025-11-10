export interface PoolPort {
  create(body: { year: number; members: { shipId: string }[] }): Promise<{
    poolId: number; year: number; poolSumBefore: number; poolSumAfter: number; valid: boolean;
    members: { shipId: string; cb_before: number; cb_after: number }[];
  }>;
}
