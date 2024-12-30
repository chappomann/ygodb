const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static('public')); // Serve static files (e.g., CSS, JS)
app.set('view engine', 'ejs'); // Set EJS as the view engine
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Read data from JSON file
function readData() {
    try {
        const data = fs.readFileSync('Yugioh.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading data:', err);
        return [];
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

// Get all data
app.get('/', (req, res) => {
    const data = readData();
    res.render('index', { data });
});

// Add new data
app.post('/add', (req, res) => {
    const newData = req.body;
    const data = readData();
    data.push(newData);
    const success = writeData(data);

    if (success) {
        res.send('<script>alert("Data added successfully!"); window.location.href = "/";</script>');
    } else {
        res.send('<script>alert("Failed to add data.");</script>');
    }
});

// Handle search
app.get('/search', (req, res) => {
    const searchTerm = req.query.q;
    const data = readData();
    const filteredData = data.filter(item =>
        Object.values(item).some(value =>
            typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
    res.render('index', { data: filteredData });
});

app.get('/scrape', (req, res) => {
    
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});