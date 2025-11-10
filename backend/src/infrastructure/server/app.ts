import Fastify from 'fastify';
import { z } from 'zod';
import cors from '@fastify/cors';
import { RouteRepoPrisma } from '../../adapters/outbound/postgres/RouteRepoPrisma.js';
import { computeRoutesComparison } from '../../core/application/usecases/ComputeComparison.js';

import { ComplianceRepoPrisma } from '../../adapters/outbound/postgres/ComplianceRepoPrisma.js';
import { computeAndStoreCB } from '../../core/application/usecases/ComputeCB.js';

import { BankingRepoPrisma } from '../../adapters/outbound/postgres/BankingRepoPrisma.js';
import { bankSurplus } from '../../core/application/usecases/BankSurplus.js';
import { applyBanked } from '../../core/application/usecases/ApplyBanked.js';


import { PoolRepoPrisma } from '../../adapters/outbound/postgres/PoolRepoPrisma.js';
import { createPool } from '../../core/application/usecases/CreatePool.js';

export function buildApp() {
  const poolRepo = new PoolRepoPrisma();

  const app = Fastify({ logger: true });
  app.register(cors, { origin: true });
  const routeRepo = new RouteRepoPrisma();
  const complianceRepo = new ComplianceRepoPrisma();
  const bankingRepo = new BankingRepoPrisma();

  app.get('/health', async () => ({ ok: true }));

  // Routes
  app.get('/routes', async () => routeRepo.listAll());
  app.post<{ Params: { id: string } }>('/routes/:id/baseline', async (req, reply) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return reply.status(400).send({ error: 'Invalid id' });
    await routeRepo.setBaseline(id);
    return { ok: true };
  });
  app.get('/routes/comparison', async () => computeRoutesComparison(routeRepo));

  // Compliance CB
  app.get('/compliance/cb', async (req, reply) => {
    const schema = z.object({
      shipId: z.string().min(1),
      year: z.coerce.number().int().gte(2000).lte(2100),
      intensity: z.coerce.number(),
      fuelTons: z.coerce.number().nonnegative(),
    });
    const parsed = schema.safeParse(req.query);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid query', details: parsed.error.flatten() });
    }
    const { shipId, year, intensity, fuelTons } = parsed.data;
    const result = await computeAndStoreCB(complianceRepo, {
      shipId, year, actualIntensity: intensity, fuelTons
    });
    return {
      shipId: result.shipId,
      year: result.year,
      energyMJ: result.energyMJ,
      targetIntensity: result.targetIntensity,
      actualIntensity: result.actualIntensity,
      cb_gco2eq: Number(result.cb_gco2eq.toFixed(4)),
      surplus: result.cb_gco2eq >= 0
    };
  });

  // Banking — records
  app.get('/banking/records', async (req, reply) => {
    const schema = z.object({
      shipId: z.string().min(1),
      year: z.coerce.number().int().optional()
    });
    const parsed = schema.safeParse(req.query);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid query', details: parsed.error.flatten() });
    }
    const { shipId, year } = parsed.data;
    const records = await bankingRepo.getBankRecords(shipId, year);
    const available = await bankingRepo.getAvailableBanked(shipId);
    return { available, records };
  });

  // Banking — bank positive CB
  app.post('/banking/bank', async (req, reply) => {
    const schema = z.object({
      shipId: z.string().min(1),
      year: z.coerce.number().int(),
      amount: z.coerce.number().positive().optional()
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid body', details: parsed.error.flatten() });
    }
     const { shipId, year, amount } = parsed.data;

  // 👇 include amount only if defined
  const input = amount === undefined ? { shipId, year } : { shipId, year, amount };

    try {
      const result = await bankSurplus(complianceRepo, bankingRepo, input);
      return result;
    } catch (e: any) {
      return reply.status(400).send({ error: e.message });
    }
  });

  // Banking — apply banked to deficit
  app.post('/banking/apply', async (req, reply) => {
    const schema = z.object({
      shipId: z.string().min(1),
      year: z.coerce.number().int(),
      amount: z.coerce.number().positive()
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid body', details: parsed.error.flatten() });
    }
    try {
      const result = await applyBanked(complianceRepo, bankingRepo, parsed.data);
      // KPIs: cb_before, applied, cb_after
      return {
        shipId: result.shipId,
        year: result.year,
        cb_before: Number(result.cb_before.toFixed(4)),
        applied: Number(result.applied.toFixed(4)),
        cb_after: Number(result.cb_after.toFixed(4)),
        availableAfter: Number(result.availableAfter.toFixed(4))
      };
    } catch (e: any) {
      return reply.status(400).send({ error: e.message });
    }
  });

  // Pooling — create pool
app.post('/pools', async (req, reply) => {
  const schema = z.object({
    year: z.coerce.number().int(),
    members: z.array(z.object({ shipId: z.string().min(1) })).min(2)
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return reply.status(400).send({ error: 'Invalid body', details: parsed.error.flatten() });
  }

  try {
    const result = await createPool(complianceRepo, poolRepo, parsed.data);
    // poolSum indicator (green if ≥ 0)
    return {
      poolId: result.poolId,
      year: result.year,
      poolSumBefore: Number(result.poolSumBefore.toFixed(4)),
      poolSumAfter: Number(result.poolSumAfter.toFixed(4)),
      valid: result.poolSumAfter >= 0,
      members: result.members.map(m => ({
        shipId: m.ship_id,
        cb_before: Number(m.cb_before.toFixed(4)),
        cb_after: Number(m.cb_after.toFixed(4))
      }))
    };
  } catch (e: any) {
    return reply.status(400).send({ error: e.message });
  }
});


  return app;
}
