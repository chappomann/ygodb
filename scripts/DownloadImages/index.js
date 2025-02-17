const fs = require('fs/promises');
const { findImgs, downloadImages } = require('./helpers/generateImgArray');

async function main() {
    const imagesToDownload = await findImgs('ygoprodeck-02-17-25.json')
    try {
        await downloadImages(imagesToDownload);
        console.log('\nDownload Completed');
    } catch (error) {
        console.error('Main error:', error);
    }
}

main().catch(console.error);