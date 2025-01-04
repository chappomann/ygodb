
const fs = require('fs');
const path = require('path');

const parentDir = path.resolve(__dirname, '../../../');

async function readJsonData(fileName) {
    try {
        const data = await fs.promises.readFile(path.join(parentDir, `./data/${fileName}`), 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error instanceof SyntaxError) {
            throw new Error(`Invalid JSON in file ${fileName}: ${error.message}`);
        }
        if (error.code === 'ENOENT') {
            throw new Error(`File not found: ${fileName}`);
        }
        throw new Error(`Error reading file ${fileName}: ${error.message}`);
    }
}

async function findImgs() {
    let data = await readJsonData('ygoprodeck-01-03-25.json');
    let newLocalData = [];
    let newLocalDataID;
    data.forEach(element => {
        newLocalDataID = element.id;
        element.card_images.forEach(cardImageObj => {
            newLocalData.push({ url: cardImageObj.image_url, fileName: newLocalDataID + '.jpg' })
        })
    });
    return newLocalData;
}

exports.findImgs = findImgs;