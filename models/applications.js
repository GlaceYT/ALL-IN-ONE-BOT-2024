const { applicationCollection } = require('../mongodb');


async function createApplication(guildId, appName) {
    const application = {
        guildId, 
        appName,
        questions: [],
        isActive: false,
        mainChannel: null,
        responseChannel: null,
    };

    await applicationCollection.insertOne(application);
}


async function addQuestion(guildId, appName, question) {
    await applicationCollection.updateOne(
        { guildId, appName },
        { $push: { questions: question } }
    );
}


async function removeQuestion(guildId, appName, questionIndex) {
    const app = await applicationCollection.findOne({ guildId, appName });
    if (!app) return;

    app.questions.splice(questionIndex, 1);
    await applicationCollection.updateOne(
        { guildId, appName },
        { $set: { questions: app.questions } }
    );
}


async function deleteApplication(guildId, appName) {
    await applicationCollection.deleteOne({ guildId, appName });
}


async function activateApplication(guildId, appName, mainChannel, responseChannel) {
    await applicationCollection.updateOne(
        { guildId, appName },
        { $set: { isActive: true, mainChannel, responseChannel } }
    );
}


async function getActiveApplication(guildId) {
    return await applicationCollection.findOne({ guildId, isActive: true });
}

async function getApplication(guildId, appName) {
    return await applicationCollection.findOne({ guildId, appName });
}
module.exports = {
    createApplication,
    addQuestion,
    removeQuestion,
    deleteApplication,
    activateApplication,
    getActiveApplication,
    getApplication,
};
