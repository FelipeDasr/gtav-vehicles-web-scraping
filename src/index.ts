import { Scraper } from './scraper';
import path from 'path';
import fs from 'fs';

(async () => {
    const scraper = new Scraper();
    await scraper.init();

    const result = await scraper.start('wiki-rage');
    await scraper.closeBrowser();

    if (fs.existsSync(path.resolve(__dirname, 'result'))) {
        fs.rmSync(path.resolve(__dirname, 'result'), { recursive: true, force: true });
    }

    fs.mkdirSync(path.resolve(__dirname, 'result'));
    fs.writeFileSync(path.resolve(__dirname, 'result', 'result.json'), JSON.stringify(result, null, 2));
})();
