const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
const colors = require('./UI/colors/colors');
const configPath = path.join(__dirname, 'config.json');


const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));


const uri = config.mongodbUri;
const client = new MongoClient(uri);

async function connectToDatabase() {
    try {
        await client.connect();
        console.log('\n' + '─'.repeat(40));
        console.log(`${colors.magenta}${colors.bright}🕸️  DATABASE CONNECTION${colors.reset}`);
        console.log('─'.repeat(40));
        console.log('\x1b[36m[ DATABASE ]\x1b[0m', '\x1b[32mConnected to MongoDB ✅\x1b[0m');
    } catch (err) {
        console.error("Error connecting to MongoDB", err);
    }
}

const db = client.db("discord-bot");
const ticketsCollection = db.collection("tickets");
const voiceChannelCollection = db.collection("voiceChannels");
const centralizedControlCollection = db.collection("centralizedControl"); 
const nqnCollection = db.collection("nqn");
const welcomeCollection = db.collection("welcomeChannels");
const autoroleCollection = db.collection("autorolesetups");
const hentaiCommandCollection = db.collection("hentailove");
const serverConfigCollection = db.collection("serverconfig");
const reactionRolesCollection = db.collection("reactionRoles");
const antisetupCollection = db.collection("antisetup");
const anticonfigcollection = db.collection("anticonfiglist")
const afkCollection = db.collection('afk');
const giveawayCollection = db.collection("giveaways");
const notificationsCollection = db.collection("notifications");
const logsCollection = db.collection("logs");
const nicknameConfigs = db.collection("nicknameConfig");
const economyCollection = db.collection("economy"); 
const usersCollection = db.collection('users'); 
const epicDataCollection = db.collection('epicData');
const customCommandsCollection = db.collection('customCommands');
const birthdayCollection = db.collection('birthday'); 
const applicationCollection = db.collection('applications'); 
const serverLevelingLogsCollection = db.collection('serverLevelingLogs');
const commandLogsCollection = db.collection('commandLogs');
const reportsCollection = db.collection('reports'); 
async function saveGiveaway(giveaway) {
    await giveawayCollection.updateOne(
        { messageId: giveaway.messageId },
        { $set: giveaway },
        { upsert: true }
    );
}

async function getGiveaways() {
    return await giveawayCollection.find().toArray();
}

async function deleteGiveaway(messageId) {
    await giveawayCollection.deleteOne({ messageId });
}

module.exports = {
    connectToDatabase,
    ticketsCollection,
    voiceChannelCollection,
    centralizedControlCollection, 
    nqnCollection,
    welcomeCollection,
    giveawayCollection,
    saveGiveaway,
    getGiveaways,
    deleteGiveaway,
    autoroleCollection,
    hentaiCommandCollection,
    serverConfigCollection,
    reactionRolesCollection,
    antisetupCollection,
    notificationsCollection,
    anticonfigcollection,
    afkCollection,
    logsCollection,
    nicknameConfigs,
    usersCollection,
    epicDataCollection,
    customCommandsCollection,
    economyCollection,
    birthdayCollection,
    applicationCollection,
    serverLevelingLogsCollection,
    commandLogsCollection,
    reportsCollection,
};
