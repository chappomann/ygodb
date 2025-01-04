
const fs = require('fs');
const path = require('path');

const parentDir = path.resolve(__dirname, '../../');

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

    function removeLeadingZeros(number) {
        return Number(number.toString().replace(/^0+/, ''));
    }

    for (const itemB of arrayB) {
        const matchingItem = arrayA.find(itemA => removeLeadingZeros(parseInt(itemA.password), 8) === itemB.id);

        mergedArray.push({
            ...itemB,
            id: matchingItem ? matchingItem.password.length === 8 ? removeLeadingZeros(parseInt(matchingItem.password), 8) : matchingItem.password : itemB.id,
            quantity: matchingItem ? matchingItem.quantity : 0
        });
    }

    return mergedArray;
}

async function updateDatabase() {
    // let data = await fetchCardInfo();
    let data = await readJsonData('./data/ygoprodeck-01-03-25.json');
    let personalData = await readJsonData('./data/Yugioh.json');
    let newLocalData = mergeArrays(personalData, data);
    await writeJsonData(path.join(parentDir, './data/yugioh-01-03-25.json'), newLocalData)
    return newLocalData;
}

// Run the script
updateDatabase().catch(console.error);