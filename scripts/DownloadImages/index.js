const fs = require('fs/promises');
const { findImgs, downloadImages } = require('./helpers/generateImgArray');

// Example usage
async function main() {
    const imagesToDownload = await findImgs('ygoprodeck-01-03-25.json')
    try {
        await downloadImages(imagesToDownload);
        console.log('\nDownload Completed');
    } catch (error) {
        console.error('Main error:', error);
    }
}

// Run the script
main().catch(console.error);