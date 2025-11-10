import type { Route, ComparisonResult } from '../domain/types';

export interface RoutesPort {
  list(): Promise<Route[]>;
  setBaseline(id: number): Promise<void>;
  comparison(): Promise<ComparisonResult>;
}
