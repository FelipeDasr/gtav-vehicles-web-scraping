import { IVehicle, VehicleType } from './vehicle';

export type IScrapingResponse = Partial<
  { [Key in keyof VehicleType]: IVehicle }[keyof VehicleType]
>;
