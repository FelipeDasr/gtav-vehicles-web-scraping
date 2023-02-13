export type VehicleType =
  | 'boats'
  | 'commercials'
  | 'compacts'
  | 'coupes'
  | 'cycles'
  | 'emergency'
  | 'helicopters'
  | 'industrial'
  | 'military'
  | 'motorcycles'
  | 'muscle'
  | 'off-road'
  | 'open wheel'
  | 'planes'
  | 'suvs'
  | 'sedans'
  | 'service'
  | 'sports'
  | 'sports classic'
  | 'super'
  | 'trailer'
  | 'trains'
  | 'utility'
  | 'vans';

export interface IVehicle {
  vehicle_name: string;
  thumbnail_url: string;
}
