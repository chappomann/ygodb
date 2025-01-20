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
    const searchTerm = 'A ';
    const data = await readJsonData('yugioh-01-19-25.json');
    const filteredData = data.filter(item =>
        item.id.toString().toLowerCase().includes(searchTerm.toString().toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    res.render('index', { dataChunks: [filteredData] });
});

app.post('/add', async (req, res) => {
    const newData = req.body;
    const data = await readJsonData('yugioh-01-19-25.json');
    let success = false;

    success = await writeJsonOrInsertData('yugioh-01-19-25.json', data, newData, newData.id)

    if (success) {
        res.send(`<script>window.location.href = "/search?q=${newData.id}";</script>`);
    } else {
        res.send('<script>alert("Failed to add data.");</script>');
    }
});

app.get('/search', async (req, res) => {
    const searchTerm = req.query.q === '' ? 'A ' : req.query.q;
    const data = await readJsonData('yugioh-01-19-25.json');
    const filteredData = data.filter(item =>
        item.id.toString().toLowerCase().includes(searchTerm.toString().toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    res.render('index', { dataChunks: [filteredData] });
});

app.get('/filter', async (req, res) => {
    const primaryCategory = req.query.primaryCategory;
    const primaryCategoryValue = req.query.primaryCategoryValue
    const secondaryCategory = req.query.secondaryCategory;
    const secondaryCategoryValue = req.query.secondaryCategoryValue
    const filter = req.query.filter;
    const data = await readJsonData('yugioh-01-19-25.json');
    const filteredData = data.filter(item => {
        if (item['quantity'] > 0) {
            if (filter === 'includes') {
                if (item[primaryCategory] && item[primaryCategoryValue] !== 'N/A' && !item[secondaryCategory]) {
                    return item[primaryCategory].toString().toLowerCase().includes(primaryCategoryValue.toString().toLowerCase());
                } if (item[primaryCategory] && item[primaryCategoryValue] != 'N/A' && item[secondaryCategory] && item[secondaryCategoryValue] != 'N/A') {
                    return (item[primaryCategory].toLowerCase().includes(primaryCategoryValue.toLowerCase()) && item[secondaryCategory].toString().includes(secondaryCategoryValue.toString().toLowerCase()))
                }
            } else {
                if (item[primaryCategory] && item[primaryCategoryValue] !== 'N/A' && !item[secondaryCategory]) {
                    return item[primaryCategory].toString().toLowerCase() === primaryCategoryValue.toString().toLowerCase();
                } if (item[primaryCategory] && item[primaryCategoryValue] != 'N/A' && item[secondaryCategory] && item[secondaryCategoryValue] != 'N/A') {
                    return (item[primaryCategory].toLowerCase() === primaryCategoryValue.toLowerCase() && item[secondaryCategory].toString() === secondaryCategoryValue.toString().toLowerCase())
                }
            }
        }
    }
    );

    res.render('index', { dataChunks: [filteredData] });
});

app.get('/searchCard', async (req, res) => {
    const id = req.query.id;
    const data = await readJsonData('yugioh-01-19-25.json');
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