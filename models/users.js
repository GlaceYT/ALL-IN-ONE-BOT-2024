const { usersCollection } = require('../mongodb');


async function createUserIfNotExists(userId) {
    const existingUser = await usersCollection.findOne({ userId });
    if (!existingUser) {
        const newUser = {
            userId,
            xp: 0,
            level: 1,
            weeklyXp: 0,
            backgroundUrl: null,
        };
        await usersCollection.insertOne(newUser);
    }
}


async function updateXp(userId, xpAmount) {
    await createUserIfNotExists(userId);

    const user = await usersCollection.findOne({ userId });
    let newXp = user.xp + xpAmount;
    const newWeeklyXp = user.weeklyXp + xpAmount;
    const level = Math.floor(0.1 * Math.sqrt(newXp)); 


    newXp = Math.max(newXp, 0);

    await usersCollection.updateOne(
        { userId },
        { $set: { xp: newXp, level, weeklyXp: newWeeklyXp } }
    );

    return { xp: newXp, level };
}



async function resetWeeklyXp() {
    await usersCollection.updateMany({}, { $set: { weeklyXp: 0 } });
}


async function getUserData(userId) {
    return await usersCollection.findOne({ userId });
}


async function getLeaderboard(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    return await usersCollection.find().sort({ xp: -1 }).skip(skip).limit(limit).toArray();
}


async function setRankCardBackground(userId, url) {
    await createUserIfNotExists(userId);
    await usersCollection.updateOne({ userId }, { $set: { backgroundUrl: url } });
}

module.exports = {
    updateXp,
    resetWeeklyXp,
    getUserData,
    getLeaderboard,
    setRankCardBackground,
};
