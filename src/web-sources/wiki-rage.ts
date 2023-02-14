import { IGtavVehicleScraper, IScrapingResponse } from '../dtos/scraping';
import { Browser } from 'puppeteer';
import { IVehicle, VehicleType } from '../dtos/vehicle';

export class IWikiRaceScraper implements IGtavVehicleScraper {
    private changedError: Error;

    constructor() {
        this.changedError = new Error('No element childrens found (possible web source changed)');
    }

    public async scrape(browser: Browser, exclude?: VehicleType[]) {
        const baseUrl = 'https://wiki.rage.mp';
        const page = await browser.newPage();
        await page.goto(baseUrl + '/index.php?title=Vehicles');

        const mainElement = await page.waitForSelector('[class="mw-parser-output"]');

        if (!mainElement) {
            throw this.changedError;
        }

        const result = await mainElement?.evaluate(
            (ele, excluded, baseUrl) => {
                const response = {} as IScrapingResponse;
                let tot = 0;
                let theNextValidElementIsCategory = false;
                let vehicleType: string | undefined;

                for (let index = 0; index < ele.children.length; index++) {
                    const element = ele.children[index];
                    const tagName = element.tagName.toLowerCase();
                    const childClassName = element.firstElementChild?.className;

                    if (tagName === 'h2' && childClassName === 'mw-headline') {
                        vehicleType = element.firstChild?.textContent?.toLowerCase();
                        theNextValidElementIsCategory = true;

                        if (excluded) {
                            if (excluded.includes(vehicleType as VehicleType)) {
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

                            if (!response[vehicleType as VehicleType]) {
                                Object.assign(response, { [vehicleType as VehicleType]: [] });
                            }
                            tot++;
                            (response[vehicleType as VehicleType] as IVehicle[]).push({
                                vehicle_name: vehicleName as string,
                                thumbnail_url: thumbUrl,
                            });
                        }
                    }
                }
                console.log(tot);
                return response;
            },
            exclude,
            baseUrl
        );

        return result;
    }
}
