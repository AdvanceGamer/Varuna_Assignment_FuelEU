import { useQuery } from '@tanstack/react-query';
import { routesApi } from '../../infrastructure/routesApi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TARGET_INTENSITY_2025 } from '../../../shared/constants';

export default function ComparePage() {
  const { data, isLoading } = useQuery({ queryKey: ['comparison'], queryFn: routesApi.comparison });

  if (isLoading) return <p>Loading…</p>;
  if (!data || !data.baseline) return <p>No baseline set yet.</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Compare</h1>

      <div className="rounded border bg-white p-3">
        <p><strong>Baseline:</strong> {data.baseline.routeId} — {data.baseline.ghgIntensity} gCO₂e/MJ</p>
      </div>

      <div className="rounded border bg-white p-3 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left">Route</th>
              <th className="px-3 py-2 text-left">gCO₂e/MJ</th>
              <th className="px-3 py-2 text-left">% Diff (vs baseline)</th>
              <th className="px-3 py-2 text-left">Compliant</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map(r => (
              <tr key={r.routeId} className="border-t">
                <td className="px-3 py-2">{r.routeId}</td>
                <td className="px-3 py-2">{r.ghgIntensity.toFixed(3)}</td>
                <td className="px-3 py-2">{r.percentDiff.toFixed(3)}%</td>
                <td className="px-3 py-2">{r.compliant ? '✅' : '❌'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="h-72 rounded border bg-white p-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.items}>
            <XAxis dataKey="routeId" />
            <YAxis />
            <Tooltip />
            <ReferenceLine y={TARGET_INTENSITY_2025} label="Target" strokeDasharray="3 3" />
            <Bar dataKey="ghgIntensity" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
