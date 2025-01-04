const { dateGenerator, fetchDataAndWriteToFile } = require('../../helpers/jsonHelper');

async function createDatabase() {
    const date = dateGenerator();
    let fileName = `ygoprodeck-${date}.json`;
    fetchDataAndWriteToFile('https://db.ygoprodeck.com/api/v7/cardinfo.php', fileName);
    return console.log(`Successfully created Database!\n\nCheck /data/${fileName}\n`);
}

createDatabase().catch(console.error);