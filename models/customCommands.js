const { customCommandsCollection } = require('../mongodb');

async function createOrUpdateCommand(userId, commandName, response) {

    const existingCommand = await customCommandsCollection.findOne({ userId, commandName });

    if (existingCommand) {
        await customCommandsCollection.updateOne(
            { userId, commandName },
            { $set: { response } }
        );
    } else {
        const newCommand = {
            userId,
            commandName,
            response,
        };
        await customCommandsCollection.insertOne(newCommand);
    }
}

async function getUserCommands(userId) {
    return await customCommandsCollection.find({ userId }).toArray();
}

async function deleteCommand(userId, commandName, isAdmin = false) {
    const query = isAdmin ? { commandName } : { userId, commandName };
    const result = await customCommandsCollection.deleteOne(query);
    return result.deletedCount > 0; 
}
module.exports = {
    createOrUpdateCommand,
    getUserCommands,
    deleteCommand,
};
