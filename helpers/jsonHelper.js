const fs = require('fs/promises');
const path = require('path');

const parentDir = path.resolve(__dirname, '../');

async function readJsonData(filePath) {
    try {
        const data = await fs.readFile(path.join(parentDir, `./data/${filePath}`), 'utf8');
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

async function writeJsonOrInsertData(filePath, oldData, newData, id) {
    try {
        const jsonOldData = JSON.parse(oldData);

        // Find the index of the object to update within the array
        const index = jsonOldData.findIndex(item => parseInt(item.id) === parseInt(id));

        if (index !== -1) {
            // Update the existing object
            jsonOldData[index] = { ...jsonOldData[index], ...newData };
        } else {
            // Append the new data to the array
            jsonOldData.push({ ...newData, id });
        }

        // Write the updated data back to the file
        await fs.writeFile(path.join(parentDir, `./data/${filePath}`), JSON.stringify(jsonOldData, null, 2));
        console.log('Data updated successfully.');
        return true;
    } catch (error) {
        console.error('Error updating JSON data:', error);
        return false;
    }
}

async function writeJsonData(filePath, data) {
    try {
        fs.writeFile(path.join(parentDir, `./data/${filePath}`), JSON.stringify(data, null, 2));
        return true;
    } catch (err) {
        console.error('Error writing data:', err);
        return false;
    }
}

// Find items by Key
async function findItemsBykey(array, key, value) {
    const foundItem = await array.find(item => item[`${key}`] === value);
    return foundItem
}

async function findItemsByID(array, value) {
    return array.find(item => parseInt(item.id) === parseInt(value));
}

function mergeArrays(arrayA, arrayB) {
    const mergedArray = [];

    function removeLeadingZeros(number) {
        return Number(number.toString().replace(/^0+/, ''));
    }

    for (const itemB of arrayB) {
        const matchingItem = arrayA.find(itemA => parseInt(itemA.id) === parseInt(itemB.id));

        mergedArray.push({
            ...itemB,
            id: matchingItem ? matchingItem.id : itemB.id,
            quantity: matchingItem ? matchingItem.quantity : 0
        });
    }

    return mergedArray;
}

function dateGenerator() {
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');

    return `${month}-${day}-${year}`;
}

module.exports = { readJsonData, writeJsonData, writeJsonOrInsertData, findItemsBykey, findItemsByID, dateGenerator, mergeArrays }