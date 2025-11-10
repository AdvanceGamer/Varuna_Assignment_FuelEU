import { useState } from 'react';
import { poolApi } from '../../infrastructure/poolApi';

// Define the expected structure of what the backend returns
type PoolMember = {
  shipId: string;
  cb_before: number;
  cb_after: number;
};

type PoolResult = {
  poolId: number; 
  year: number;
  valid: boolean;
  poolSumBefore: number;
  poolSumAfter: number;
  members: PoolMember[];
  error?: string;
};

export default function PoolingPage() {
  const [year, setYear] = useState<number>(2025);
  const [ships, setShips] = useState<string>('S001,S002');
  const [result, setResult] = useState<PoolResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const onCreate = async (): Promise<void> => {
    setLoading(true);
    try {
      const members = ships
        .split(',')
        .map((s) => ({ shipId: s.trim() }))
        .filter((x) => x.shipId);

      const res = await poolApi.create({ year, members });
      setResult(res as PoolResult);
    } catch (e: unknown) {
      const err = e instanceof Error ? e.message : String(e);
      setResult({ error: err } as PoolResult);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Pooling</h1>

      <div className="rounded border bg-white p-3 space-y-2">
        <div className="flex gap-2">
          <input
            className="border rounded px-2 py-1 w-24"
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          />
          <input
            className="border rounded px-2 py-1 flex-1"
            value={ships}
            onChange={(e) => setShips(e.target.value)}
            placeholder="Comma-separated ship IDs"
          />
          <button
            className="px-3 py-1 rounded bg-blue-600 text-white"
            onClick={onCreate}
            disabled={loading}
          >
            {loading ? 'Creating…' : 'Create Pool'}
          </button>
        </div>
      </div>

      {result && !result.error && (
        <div className="rounded border bg-white p-3">
          <div className="mb-2 text-sm text-gray-700">
            Pool #{result.poolId} — Year {result.year} — Sum Before{' '}
            {result.poolSumBefore.toFixed(2)} — Sum After{' '}
            {result.poolSumAfter.toFixed(2)} —{' '}
            {result.valid ? '✅ Valid' : '❌ Invalid'}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left">Ship</th>
                  <th className="px-3 py-2 text-left">CB Before</th>
                  <th className="px-3 py-2 text-left">CB After</th>
                </tr>
              </thead>
              <tbody>
                {result.members.map((m, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-3 py-2">{m.shipId}</td>
                    <td className="px-3 py-2">{m.cb_before.toFixed(2)}</td>
                    <td className="px-3 py-2">{m.cb_after.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {result?.error && (
        <div className="rounded border bg-red-50 p-3 text-red-700">
          {result.error}
        </div>
      )}
    </div>
  );
}
