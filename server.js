const express = require('express');
const bodyParser = require('body-parser');
const { readJsonData, writeJsonOrInsertData, findItemsBykey } = require('./helpers/jsonHelper')

const app = express();
const port = 3000;
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
    const searchTerm = 'a';
    const data = await readJsonData('yugioh-01-04-25.json');
    const filteredData = data.filter(item =>
        item.id.toString().toLowerCase().includes(searchTerm.toString().toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    res.render('index', { dataChunks: [filteredData] });
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
        item.id.toString().toLowerCase().includes(searchTerm.toString().toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    res.render('index', { dataChunks: [filteredData] });
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