const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

async function writeJsonData(filePath, newData, uniqueKeyField = 'password') {
    try {
        let existingData = [];

        // Try to read existing file
        try {
            const data = await readJsonData('Yugioh.json');
            existingData = JSON.parse(data);

            // Ensure existingData is an array
            if (!Array.isArray(existingData)) {
                existingData = [existingData];
            }
        } catch (readError) {
            // If file doesn't exist or is empty, continue with empty array
            if (readError.code !== 'ENOENT') {
                throw readError;
            }
        }

        // Ensure newData is an array
        const dataToProcess = Array.isArray(newData) ? newData : [newData];

        // Update existing records or add new ones
        const updatedData = existingData.map(item => {
            const newItem = dataToProcess.find(
                newItem => newItem[uniqueKeyField] === item[uniqueKeyField]
            );
            return newItem ? { ...item, ...newItem } : item;
        });

        // Add completely new records
        const newRecords = dataToProcess.filter(newItem =>
            !existingData.some(item => item[uniqueKeyField] === newItem[uniqueKeyField])
        );

        const finalData = [...updatedData, ...newRecords];

        // Write the combined data back to file
        await fs.promises.writeFile(filePath, JSON.stringify(finalData, null, 2), 'utf8');

        return {
            success: true,
            message: `Data successfully processed for ${filePath}`,
            updatedCount: updatedData.length - existingData.length + newRecords.length,
            totalRecords: finalData.length
        };

    } catch (error) {
        console.error(`Error processing JSON data for ${filePath}:`, error);
        throw error;
    }
}

// Write data to JSON file
function writeData(data) {
    try {
        fs.writeFileSync('Yugioh.json', JSON.stringify(data, null, 2));
        return true;
    } catch (err) {
        console.error('Error writing data:', err);
        return false;
    }
}
// Find items by Key
function findItemsBykey(array, key, value) {
    return array.find(item => item[key] === value);
}

// Update the JSON Records
function updateRecordInJson(filePath, key, value, updatedData) {
    try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        const index = data.findIndex(item => item[key] === value);

        if (index !== -1) {
            data[index] = updatedData;
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
            console.log(`Record with ${key}=${value} updated successfully.`);
            return true;
        } else {
            console.log(`Record with ${key}=${value} not found.`);
            return false;
        }

    } catch (err) {
        console.error('Error updating record:', err);
    }
}

// Get all data
app.get('/', async (req, res) => {
    const data = await readJsonData('Yugioh.json');
    res.render('index', { data });
});

// Add new data (smart enough to update now)
app.post('/add', async (req, res) => {
    const newData = req.body;
    const data = await readJsonData('Yugioh.json');
    const foundItem = findItemsBykey(data, 'password', newData.password)
    const recordExists = !!foundItem
    let success = false;

    success = writeJsonData('Yugioh.json', newData)

    // if (recordExists) {
    //     success = updateRecordInJson('Yugioh.json', 'password', newData.password, { ...foundItem, quantity: `${parseInt(newData.quantity) + parseInt(foundItem.quantity)}` })
    // } else {
    //     data.push(newData);
    //     success = writeData(data);
    // }

    if (success && !!success.succes) {
        res.send('<script>window.location.href = "/";</script>');
    } else {
        res.send('<script>alert("Failed to add data.");</script>');
    }
});

// Handle search
app.get('/search', async (req, res) => {
    const searchTerm = req.query.q;
    const data = await readJsonData('Yugioh.json');
    const filteredData = data.filter(item =>
        Object.values(item).some(value =>
            typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
    res.render('index', { data: filteredData });
});

// Handle search card quantity
app.get('/searchCard', async (req, res) => {
    const password = req.query.password;
    const data = await readJsonData('Yugioh.json');
    const foundItem = findItemsBykey(data, 'password', password)
    const recordExists = !!foundItem

    if (recordExists) {
        res.send({ ...foundItem, found: foundItem.quantity })
    } else {
        res.send({ found: 0 });
    }
});

app.get('/scrape', (req, res) => {

})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});