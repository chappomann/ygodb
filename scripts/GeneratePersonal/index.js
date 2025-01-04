
const fs = require('fs');
const path = require('path');

const parentDir = path.resolve(__dirname, '../../');

async function fetchCardInfo() {
    try {
        const response = await fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php');

        if (!response.ok) {
            throw new Error(`Error fetching card info: ${response.status}`);
        }

        const data = await response.json();
        console.log('Card info fetched successfully!');
        return [data];
    } catch (error) {
        console.error('Error fetching card info:', error);
    }
}

async function readJsonData(filePath) {
    try {
        const data = await fs.promises.readFile(path.join(parentDir, filePath), 'utf8');
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

async function writeJsonData(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (err) {
        console.error('Error writing data:', err);
        return false;
    }
}

function mergeArrays(arrayA, arrayB) {
    const mergedArray = [];

    for (const itemB of arrayB) {
        const matchingItem = arrayA.find(itemA => itemA.password === parseInt(itemB.id));

        if (matchingItem) {
            mergedArray.push({
                ...itemB,
                quantity: matchingItem.quantity
            });
        } else {
            mergedArray.push({
                ...itemB,
                quantity: 0
            });
        }
    }

    return mergedArray;
}

async function updateDatabase() {
    let data = await fetchCardInfo();
    // let data = await readJsonData('./data/ygoprodeck-01-03-25.json');
    let personalData = await readJsonData('./data/Yugioh.json');
    let newLocalData = mergeArrays(personalData, data);
    await writeJsonData(path.join(parentDir, './data/yugioh-01-03-25.json'), newLocalData)
    return newLocalData;
}

// Run the script
updateDatabase().catch(console.error);