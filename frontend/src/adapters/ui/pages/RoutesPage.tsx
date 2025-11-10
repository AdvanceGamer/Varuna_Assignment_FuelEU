import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { routesApi } from '../../infrastructure/routesApi';
import type { Route } from '../../../core/domain/types';
import { DataTable } from '../components/DataTable';
import Card from '../components/Card';
import Button from '../components/Button';
import Spinner from '../components/Spinner';

export default function RoutesPage() {
  const qc = useQueryClient();
  const { data: routes = [], isLoading } = useQuery({ queryKey: ['routes'], queryFn: routesApi.list });

  const [vesselType, setVessel] = useState('');
  const [fuelType, setFuel] = useState('');
  const [year, setYear] = useState('');

  const filtered = useMemo(() => {
    return routes.filter((r) =>
      (!vesselType || r.vessel_type === vesselType) &&
      (!fuelType || r.fuel_type === fuelType) &&
      (!year || String(r.year) === year)
    );
  }, [routes, vesselType, fuelType, year]);

  const setBaseline = useMutation({
    mutationFn: (id: number) => routesApi.setBaseline(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['routes'] });
      qc.invalidateQueries({ queryKey: ['comparison'] });
    },
    onError: (e: unknown) => alert(e instanceof Error ? e.message : String(e)),
  });

  const unique = <K extends keyof Route>(key: K) =>
    Array.from(new Set(routes.map((r) => r[key]).filter(Boolean))) as string[] | number[];

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Routes</h1>
          <p className="text-sm text-gray-600">Manage baselines and filter data by vessel, fuel, and year.</p>
        </div>
        <div className="hidden md:block text-sm text-gray-500">
          {routes.length ? `${routes.length} total routes` : ''}
        </div>
      </div>

      <Card>
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Vessel Type</label>
            <select className="input" value={vesselType} onChange={e=>setVessel(e.target.value)}>
              <option value="">All</option>
              {unique('vessel_type').map(v => <option key={String(v)} value={String(v)}>{String(v)}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Fuel Type</label>
            <select className="input" value={fuelType} onChange={e=>setFuel(e.target.value)}>
              <option value="">All</option>
              {unique('fuel_type').map(v => <option key={String(v)} value={String(v)}>{String(v)}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Year</label>
            <select className="input" value={year} onChange={e=>setYear(e.target.value)}>
              <option value="">All</option>
              {unique('year').map(v => <option key={String(v)} value={String(v)}>{String(v)}</option>)}
            </select>
          </div>
        </div>
      </Card>

      {isLoading ? (
        <Spinner />
      ) : (
        <DataTable<Route>
          columns={[
            { key: 'route_id', header: 'Route' },
            { key: 'vessel_type', header: 'Vessel' },
            { key: 'fuel_type', header: 'Fuel' },
            { key: 'year', header: 'Year' },
            { key: 'ghg_intensity', header: 'gCO₂e/MJ' },
            { key: 'fuel_tons', header: 'Fuel (t)' },
            { key: 'distance_km', header: 'Distance (km)' },
            { key: 'total_emissions', header: 'Emissions (t)' },
            { key: 'is_baseline', header: 'Baseline', render: (v) => (v ? <span className="badge badge-green">Baseline</span> : '') },
            {
              key: 'id',
              header: 'Actions',
              render: (_, row) => (
                <Button
                  disabled={row.is_baseline || setBaseline.isPending}
                  onClick={() => setBaseline.mutate(row.id)}
                >
                  Set Baseline
                </Button>
              ),
            },
          ]}
          rows={filtered}
        />
      )}
    </div>
  );
}
