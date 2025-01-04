const { readJsonData, writeJsonData, mergeArrays, dateGenerator, findItemsBykey } = require('../../helpers/jsonHelper')

async function updateDatabase() {
    const date = dateGenerator();
    // let data = await fetchCardInfo();
    let data = await readJsonData('ygoprodeck-01-03-25.json');
    let oldData = await readJsonData('yugioh-01-03-25.json');
    let newLocalData = mergeArrays(oldData, data);
    await writeJsonData(`yugioh-${date}.json`, newLocalData)
    return console.log(`Successfully updated Database!\n\nCheck /data/yugioh-${date}.json\n`);
}

// Run the script
updateDatabase().catch(console.error);