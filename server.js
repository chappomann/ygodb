const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

const parentDir = path.resolve(__dirname, '.');

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

async function readJsonData(filePath) {
    try {
        const data = await fs.promises.readFile(path.join(parentDir, `/data/${filePath}`), 'utf8');
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

async function writeJsonData(filePath, newData, id) {
    try {
        const data = await readJsonData(filePath);
        const jsonData = data;

        // Find the index of the object to update within the array
        const index = jsonData.findIndex(item => parseInt(item.id) === parseInt(id));

        if (index !== -1) {
            // Update the existing object
            jsonData[index] = { ...jsonData[index], ...newData };
        } else {
            // Append the new data to the array
            jsonData.push({ ...newData, id });
        }

        // Write the updated data back to the file
        await fs.promises.writeFile(path.join(parentDir, `/data/${filePath}`), JSON.stringify(jsonData, null, 2));

        console.log('Data updated successfully.');
        return true;
    } catch (error) {
        console.error('Error updating JSON data:', error);
        return false;
    }
}

// Find items by Key
async function findItemsBykey(array, key, value) {
    const foundItem = await array.find(item => item[`${key}`] === parseInt(value));
    return foundItem
}

async function findItemsByID(array, value) {
    return array.find(item => parseInt(item.id) === parseInt(value));
}

// Get all data
app.get('/', async (req, res) => {
    const data = await readJsonData('yugioh-01-03-25.json');
    res.render('index', { data });
});

// Add new data (smart enough to update now)
app.post('/add', async (req, res) => {
    const newData = req.body;
    const data = await readJsonData('yugioh-01-03-25.json');
    let success = false;

    success = await writeJsonData('yugioh-01-03-25.json', newData, newData.id)

    if (success) {
        res.send('<script>window.location.href = "/";</script>');
    } else {
        res.send('<script>alert("Failed to add data.");</script>');
    }
});

// Handle search
app.get('/search', async (req, res) => {
    const searchTerm = req.query.q;
    const data = await readJsonData('yugioh-01-03-25.json');
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
    const data = await readJsonData('yugioh-01-03-25.json');
    const foundItem = await findItemsByID(data, password)
    const recordExists = !!foundItem

    if (recordExists) {
        res.send({ ...foundItem, found: foundItem.quantity })
    } else {
        res.send({ found: 0, name: 'N/A' });
    }
});

app.get('/scrape', (req, res) => {

})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});