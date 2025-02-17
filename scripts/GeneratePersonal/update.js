const { readJsonData, writeJsonData, mergeArrays, dateGenerator, fetchDataAndWriteToFile } = require('../../helpers/jsonHelper');

async function updateDatabase() {
    const date = dateGenerator();
    let fileName = `yugioh-${date}.json`;
    let data = await readJsonData('ygoprodeck-02-17-25.json');
    let oldData = await readJsonData('ygodb.cards-02-17-25old.json'); //if you already have data
    // let oldData = JSON.parse([]); //if you have no data
    let newLocalData = mergeArrays(oldData, data);
    await writeJsonData(fileName, newLocalData)
    return console.log(`Successfully updated Database!\n\nCheck /data/yugioh-${date}.json\n`);
}

updateDatabase().catch(console.error);