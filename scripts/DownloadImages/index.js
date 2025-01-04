const fs = require('fs/promises');
const { findImgs } = require('./helpers/generateImgArray');
const path = require('path');

const parentDir = path.resolve(__dirname, '../../');

async function downloadImages(images) {
    for (const { url, fileName } of images) {
        try {
            await fs.access(path.join(parentDir, `./public/img/${fileName}`), fs.constants.F_OK);
            console.log(`File already exists: ${path.join(parentDir, `./public/img/${fileName}`)}`);
        } catch (error) {
            const response = await fetch(url);

            if (!response.ok) {
                console.log(`Failed to fetch ${url}: ${response.status}`);
            }

            const buffer = await response.arrayBuffer();
            await fs.writeFile(path.join(parentDir, `./public/img/${fileName}`), Buffer.from(buffer));

            console.log(`Downloaded ${url} to ${path.join(parentDir, `./public/img/${fileName}`)}`);
        }
    }
}

// Example usage
async function main() {
    const imagesToDownload = await findImgs()
    try {
        await downloadImages(imagesToDownload);
        console.log('\nDownload Completed');
    } catch (error) {
        console.error('Main error:', error);
    }
}

// Run the script
main().catch(console.error);