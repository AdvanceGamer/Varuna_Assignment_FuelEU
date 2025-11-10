import type { RouteEntity } from '../domain/entities.js';


export interface RouteRepo {
  listAll(): Promise<RouteEntity[]>;
  getBaseline(): Promise<RouteEntity | null>;
  setBaseline(id: number): Promise<void>;
}
