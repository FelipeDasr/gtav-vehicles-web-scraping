import { Scraper } from './scraper';

(async () => {
    const scraper = new Scraper();
    await scraper.init();

    const result = await scraper.start('wiki-rage');
    await scraper.closeBrowser();

    console.log(result);
})();
