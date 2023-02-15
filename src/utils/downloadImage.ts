import path from 'path';
import axios from 'axios';
import fs from 'fs';

export async function downloadImage(url: string, filename: string) {
    const filePath = path.resolve(__dirname, 'output', 'images', `${filename}.jpg`);
    const writer = fs.createWriteStream(filePath);

    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream',
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}
