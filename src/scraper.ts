import { IWikiRaceScraper } from './web-sources/wiki-rage';
import puppeteer, { Browser } from 'puppeteer';
import { IWebSource } from './dtos/webSources';
import { VehicleType } from './dtos/vehicle';

export class Scraper {
    private browser: Browser;

    constructor() {
        this.browser = {} as Browser;
    }

    public async init() {
        await this.setBrowser();
    }

    private async setBrowser() {
        this.browser = await puppeteer.launch({
            headless: true,
            timeout: 10000,
        });
    }

    private async getWebSource(source: IWebSource) {
        switch (source) {
            case 'wiki-rage':
                return new IWikiRaceScraper();
        }
    }

    public async closeBrowser() {
        await this.browser.close();
    }

    public async start(sourceName: IWebSource, categoriesToExclude?: VehicleType[], vehiclesToExclude?: string[]) {
        const source = await this.getWebSource(sourceName);
        return source.scrape(this.browser, categoriesToExclude, vehiclesToExclude);
    }
}
