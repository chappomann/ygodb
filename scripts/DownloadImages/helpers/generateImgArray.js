
const fs = require('fs');

async function readJsonData(filePath) {
    try {
        const data = await fs.promises.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error instanceof SyntaxError) {
            throw new Error(`Invalid JSON in file ${filePath}: ${error.message}`);
        }
        if (error.code === 'ENOENT') {
            throw new Error(`File not found: ${filePath}`);
        }
        throw new Error(`Error reading file ${filePath}: ${error.message}`);
    }
}

async function findImgs() {
    let data = await readJsonData('ygoprodeck-01-03-25.json');
    let newLocalData = [];
    let newLocalDataID;
    data.forEach(element => {
        newLocalDataID = element.id;
        element.card_images.forEach(cardImageObj => {
            newLocalData.push({ url: cardImageObj.image_url, filename: newLocalDataID + '.jpg' })
        })
    });
    return newLocalData;
}

exports.findImgs = findImgs;