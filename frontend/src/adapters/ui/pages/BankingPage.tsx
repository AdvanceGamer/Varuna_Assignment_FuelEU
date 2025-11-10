import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { complianceApi } from '../../infrastructure/complianceApi';
import { bankingApi } from '../../infrastructure/bankingApi';
import { useState } from 'react';


export default function BankingPage() {
  const qc = useQueryClient();
  const [shipId, setShip] = useState('S001');
  const [year, setYear] = useState<number>(2025);
  const [intensity, setIntensity] = useState<number>(90.5);
  const [fuelTons, setFuel] = useState<number>(4950);
  const [applyAmount, setApply] = useState<number>(50000);

  const { data: records } = useQuery({
    queryKey: ['banking', shipId],
    queryFn: () => bankingApi.records({ shipId }),
  });

  const compute = useMutation({
    mutationFn: () => complianceApi.computeCB({ shipId, year, intensity, fuelTons }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['banking', shipId] }),
  });

  const bank = useMutation({
    mutationFn: () => bankingApi.bank({ shipId, year }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['banking', shipId] }),
  });

  const apply = useMutation({
    mutationFn: () => bankingApi.apply({ shipId, year, amount: applyAmount }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['banking', shipId] }),
  });

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Banking</h1>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded border bg-white p-3 space-y-2">
          <h2 className="font-medium">Compute CB</h2>
          <div className="flex gap-2">
            <input className="border rounded px-2 py-1 w-24" value={shipId} onChange={e=>setShip(e.target.value)} />
            <input className="border rounded px-2 py-1 w-24" type="number" value={year} onChange={e=>setYear(Number(e.target.value))} />
            <input className="border rounded px-2 py-1 w-32" type="number" step="0.001" value={intensity} onChange={e=>setIntensity(Number(e.target.value))} placeholder="intensity" />
            <input className="border rounded px-2 py-1 w-24" type="number" value={fuelTons} onChange={e=>setFuel(Number(e.target.value))} placeholder="fuel t" />
            <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={()=>compute.mutate()} disabled={compute.isPending}>Compute</button>
          </div>
          {compute.data && (
            <div className="text-sm text-gray-700">
              CB: {compute.data.cb_gco2eq.toFixed(2)} ({compute.data.surplus ? 'Surplus' : 'Deficit'})
            </div>
          )}
        </div>

        <div className="rounded border bg-white p-3 space-y-2">
          <h2 className="font-medium">Bank & Apply</h2>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded bg-emerald-600 text-white" onClick={()=>bank.mutate()} disabled={bank.isPending}>Bank Full</button>
            <input className="border rounded px-2 py-1 w-28" type="number" value={applyAmount} onChange={e=>setApply(Number(e.target.value))} />
            <button className="px-3 py-1 rounded bg-orange-600 text-white" onClick={()=>apply.mutate()} disabled={apply.isPending}>Apply</button>
          </div>
          <div className="text-sm text-gray-700">
            Available: {records?.available?.toFixed?.(2) ?? 0}
          </div>
        </div>
      </div>

      <div className="rounded border bg-white p-3">
        <h3 className="font-medium mb-2">Records</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left">Year</th>
                <th className="px-3 py-2 text-left">Amount</th>
                <th className="px-3 py-2 text-left">Time</th>
              </tr>
            </thead>
            <tbody>
              {records?.records?.map((r, i) => (
                <tr key={i} className="border-t">
                  <td className="px-3 py-2">{r.year}</td>
                  <td className="px-3 py-2">{r.amount}</td>
                  <td className="px-3 py-2">{r.created_at?.toString?.().replace('T',' ').slice(0,19) ?? ''}</td>
                </tr>
              )) ?? null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
