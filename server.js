const express = require('express');
const bodyParser = require('body-parser');
const { readJsonData, writeJsonOrInsertData, findItemsBykey } = require('./helpers/jsonHelper')

const app = express();
const port = 3000;
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const chunkSize = 1000;

app.get('/', async (req, res) => {
    try {
        const data = await readJsonData('yugioh-01-04-25.json');

        let dataChunks = [];
        for (let i = 0; i < data.length; i += chunkSize) {
            dataChunks.push(data.slice((i, i + chunkSize)))
        }

        res.render('index', { dataChunks });
    } catch (err) {
        console.error('Error reading data:', err);
        res.status(500).send('Internal Server Error')
    }
});

app.get('/data/:chunkIndex', async (req, res) => {
    try {
        const data = await readJsonData('yugioh-01-04-25.json');
        const chunkIndex = parseInt(req.params.chunkIndex);
        const start = chunkIndex * chunkSize;
        const end = start + chunkSize;
        const chunk = data.slice(start, end);
        res.json(chunk);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/add', async (req, res) => {
    const newData = req.body;
    const data = await readJsonData('yugioh-01-04-25.json');
    let success = false;

    success = await writeJsonOrInsertData('yugioh-01-04-25.json', data, newData, newData.id)

    if (success) {
        res.send('<script>window.location.href = "/";</script>');
    } else {
        res.send('<script>alert("Failed to add data.");</script>');
    }
});

app.get('/search', async (req, res) => {
    const searchTerm = req.query.q;
    const data = await readJsonData('yugioh-01-04-25.json');
    const filteredData = data.filter(item =>
        Object.values(item).some(value =>
            typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
    res.render('index', { data: filteredData });
});

app.get('/searchCard', async (req, res) => {
    const id = req.query.id;
    const data = await readJsonData('yugioh-01-04-25.json');
    const foundItem = await findItemsBykey(data, 'id', parseInt(id))
    const recordExists = !!foundItem

    if (recordExists) {
        res.send({ ...foundItem, found: foundItem.quantity })
    } else {
        res.send({ found: 0, name: 'N/A' });
    }
});

app.get('/scrape', (req, res) => {
    res.send({ status: 'ok' })
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});