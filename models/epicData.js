const { epicDataCollection } = require('../mongodb');


async function createEpicDataIfNotExists(userId) {
    const existingData = await epicDataCollection.findOne({ userId });
    if (!existingData) {
        const newEpicData = {
            userId,
            epic: null, 
        };
        await epicDataCollection.insertOne(newEpicData);
    }
}


async function setEpic(userId, epic) {
    await createEpicDataIfNotExists(userId);
    await epicDataCollection.updateOne({ userId }, { $set: { epic } });
}


async function getEpic(userId) {
    const epicData = await epicDataCollection.findOne({ userId });
    return epicData ? epicData.epic : null;
}
async function removeEpic(userId) {
    await epicDataCollection.updateOne({ userId }, { $unset: { epic: "" } });
}

module.exports = {
    setEpic,
    getEpic,
    removeEpic,
};
