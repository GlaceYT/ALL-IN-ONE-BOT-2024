// models/economy.js
const { economyCollection } = require('../mongodb');


async function createEconomyProfileIfNotExists(userId) {
    const existingProfile = await economyCollection.findOne({ userId });
    if (!existingProfile) {

        const newProfile = {
            userId,
            wallet: 1,
            bank: 0,
            dailyStreak: 0,
            lastDaily: null,
            lastWeekly: null,
            lastWork: null,
            lastBeg: null,
            lastRob: null,
            lastGamble: null,
            inventory: [],
            house: null,
            bills: {
                rentDueDate: null,
                utilitiesDueDate: null,
                unpaidRent: 0,
                unpaidUtilities: 0
            },
            evictionNotice: false
        };
        await economyCollection.insertOne(newProfile);
    } else {
  
        const updates = {};
        if (typeof existingProfile.wallet !== 'number' || isNaN(existingProfile.wallet)) updates.wallet = 1;
        if (typeof existingProfile.bank !== 'number' || isNaN(existingProfile.bank)) updates.bank = 0;

     
        if (Object.keys(updates).length > 0) {
            await economyCollection.updateOne({ userId }, { $set: updates });
        }
    }
}



async function getEconomyProfile(userId) {
    await createEconomyProfileIfNotExists(userId);
    return await economyCollection.findOne({ userId });
}
async function updateWallet(userId, amount) {
    await createEconomyProfileIfNotExists(userId);
    return await economyCollection.updateOne({ userId }, { $inc: { wallet: amount } });
}

async function updateEconomyProfile(userId, updateData) {
    await createEconomyProfileIfNotExists(userId);
    return await economyCollection.updateOne({ userId }, { $set: updateData });
}
async function buyHouse(userId, houseDetails) {
    await createEconomyProfileIfNotExists(userId);
    return await economyCollection.updateOne({ userId }, { 
        $set: { house: houseDetails, "bills.rentDueDate": Date.now() + 30 * 24 * 60 * 60 * 1000 } 
    });
}

async function buyHouse(userId, houseDetails) {
    await createEconomyProfileIfNotExists(userId);
    return await economyCollection.updateOne({ userId }, { 
        $set: { 
            house: houseDetails,
            "bills.rentDueDate": Date.now() + 30 * 24 * 60 * 60 * 1000,
            "bills.utilitiesDueDate": Date.now() + 30 * 24 * 60 * 60 * 1000, 
            evictionNotice: false 
        } 
    });
}

async function sellHouse(userId) {
    await createEconomyProfileIfNotExists(userId);
    return await economyCollection.updateOne({ userId }, { 
        $set: { house: null, "bills.unpaidRent": 0, "bills.unpaidUtilities": 0, evictionNotice: false } 
    });
}

async function updateBills(userId, billsUpdate) {
    await createEconomyProfileIfNotExists(userId);
    return await economyCollection.updateOne({ userId }, { $set: { bills: billsUpdate } });
}

async function handleEviction(userId) {
    await createEconomyProfileIfNotExists(userId);
    return await economyCollection.updateOne({ userId }, { 
        $set: { house: null, "bills.unpaidRent": 0, evictionNotice: true } 
    });
}
module.exports = {
    createEconomyProfileIfNotExists,
    getEconomyProfile,
    updateEconomyProfile,
    updateWallet,
    buyHouse,
    sellHouse,
    updateBills,
    handleEviction
};
