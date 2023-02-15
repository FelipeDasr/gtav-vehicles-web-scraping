import { Scraper } from './scraper';
import fs from 'fs';

(async () => {
    const scraper = new Scraper();
    await scraper.init();

    const result = await scraper.start('wiki-rage');
    await scraper.closeBrowser();

    fs.writeFileSync('result.json', JSON.stringify(result, null, 2));
})();
