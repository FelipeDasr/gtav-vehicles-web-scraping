import { IGtavVehicleScraper, IScrapingResponse } from '../dtos/scraping';
import { Browser } from 'puppeteer';
import { IVehicle, VehicleType } from '../dtos/vehicle';

export class IWikiRaceScraper implements IGtavVehicleScraper {
    private changedError: Error;

    constructor() {
        this.changedError = new Error('No element childrens found (possible web source changed)');
    }

    public async scrape(browser: Browser, categoriesToExclude?: VehicleType[], vehiclesToExclude?: string[]) {
        const baseUrl = 'https://wiki.rage.mp';
        const page = await browser.newPage();
        await page.goto(baseUrl + '/index.php?title=Vehicles');

        const mainElement = await page.waitForSelector('[class="mw-parser-output"]');

        if (!mainElement) {
            throw this.changedError;
        }

        const result = await mainElement?.evaluate(
            (ele, categoriesToExclude, baseUrl, vehiclesToExclude) => {
                const response = {} as IScrapingResponse;
                let theNextValidElementIsCategory = false;
                let vehicleType: string | undefined;

                for (let index = 0; index < ele.children.length; index++) {
                    const element = ele.children[index];
                    const tagName = element.tagName.toLowerCase();
                    const childClassName = element.firstElementChild?.className;

                    if (tagName === 'h2' && childClassName === 'mw-headline') {
                        vehicleType = element.firstChild?.textContent?.toLowerCase();
                        theNextValidElementIsCategory = true;

                        if (categoriesToExclude) {
                            if (categoriesToExclude.includes(vehicleType as VehicleType)) {
                                console.log('Excluded: ' + vehicleType);
                                theNextValidElementIsCategory = false;
                                continue;
                            }
                        }
                    } else if (tagName === 'ul' && childClassName === 'gallerybox' && theNextValidElementIsCategory) {
                        for (let childIndex = 0; childIndex < element.children.length; childIndex++) {
                            const vehicleElement = element.children[childIndex];

                            const thumbImgElement = vehicleElement.getElementsByTagName('img')[0];
                            const thumbUrl = `${baseUrl}${thumbImgElement.getAttribute('src')}`;

                            const vehicleNameElement = vehicleElement.querySelector('div.gallerytext > p > code');
                            const vehicleName = vehicleNameElement?.textContent;

                            if (vehiclesToExclude) {
                                if (vehiclesToExclude.includes(vehicleName as string)) continue;
                            }

                            if (!response[vehicleType as VehicleType]) {
                                Object.assign(response, { [vehicleType as VehicleType]: [] });
                            }

                            (response[vehicleType as VehicleType] as IVehicle[]).push({
                                vehicle_name: vehicleName as string,
                                thumbnail_url: thumbUrl,
                            });
                        }
                    }
                }

                return response;
            },
            categoriesToExclude,
            baseUrl,
            vehiclesToExclude
        );

        return result;
    }
}
