
const fs = require('fs/promises');
const { readJsonData } = require('../../../helpers/jsonHelper')
const path = require('path');

const parentDir = path.resolve(__dirname, '../../../');

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

async function findImgs(filename) {
    let data = await readJsonData(filename);
    let newLocalData = [];
    let newLocalDataID;
    data.forEach(element => {
        newLocalDataID = element.id;
        element.card_images.forEach(cardImageObj => {
            newLocalData.push({ url: cardImageObj.image_url_small, fileName: newLocalDataID + '.jpg' })
        })
    });
    return newLocalData;
}

module.exports = { findImgs, downloadImages };