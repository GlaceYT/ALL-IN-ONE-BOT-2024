
const { birthdayCollection } = require('../mongodb');

async function setBirthday(userId, birthday) {
    const existingProfile = await birthdayCollection.findOne({ userId });
    if (existingProfile) {
        await birthdayCollection.updateOne({ userId }, { $set: { birthday } });
    } else {
        await birthdayCollection.insertOne({ userId, birthday });
    }
}

async function removeBirthday(userId) {
    await birthdayCollection.deleteOne({ userId });
}

async function getBirthday(userId) {
    return await birthdayCollection.findOne({ userId });
}

async function getAllBirthdays() {
    return await birthdayCollection.find({}).toArray();
}

module.exports = {
    setBirthday,
    removeBirthday,
    getBirthday,
    getAllBirthdays,
};
