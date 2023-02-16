import { IVehicle, VehicleType } from './vehicle';
import { Browser } from 'puppeteer';

export type IScrapingResponse = Partial<{ [Key in VehicleType]: IVehicle[] }>;
export interface IGtavVehicleScraper {
    scrape(browser: Browser, categoriesToExclude?: VehicleType[], vehiclesToExclude?: string[]): Promise<IScrapingResponse>;
}
