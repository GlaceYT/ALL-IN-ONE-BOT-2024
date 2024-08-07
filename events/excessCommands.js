const { hentaiCommandCollection, serverConfigCollection } = require('../mongodb');
const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../config.json');

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot) return;

       
        const hentaiSettings = await hentaiCommandCollection.findOne({ serverId: message.guild.id });

      
        let serverConfig;
        try {
            serverConfig = await serverConfigCollection.findOne({ serverId: message.guild.id });
        } catch (err) {
            console.error('Error fetching server configuration from MongoDB:', err);
        }

       
        const prefix = serverConfig && serverConfig.prefix ? serverConfig.prefix : config.prefix;

        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        let command;

        const getCommandPath = (category, commandName) => {
            return path.join(__dirname, '..', 'excesscommands', category, `${commandName}.js`);
        };

        
        if (config.excessCommands) {
            if (fs.existsSync(getCommandPath('hentai', commandName))) {
                if (!hentaiSettings || !hentaiSettings.status) {
                    return message.reply('Hentai commands are currently disabled.');
                }
                command = require(getCommandPath('hentai', commandName));
            } else if (config.excessCommands.lavalink && fs.existsSync(getCommandPath('lavalink', commandName))) {
                command = require(getCommandPath('lavalink', commandName));
            } else if (config.excessCommands.troll && fs.existsSync(getCommandPath('troll', commandName))) {
                command = require(getCommandPath('troll', commandName));
            } else if (config.excessCommands.other && fs.existsSync(getCommandPath('other', commandName))) {
                command = require(getCommandPath('other', commandName));
            } else if (config.excessCommands.utility && fs.existsSync(getCommandPath('utility', commandName))) {
                command = require(getCommandPath('utility', commandName));
            }
        } else {
            console.error('excessCommands is not defined in the config file.');
            return message.reply('Command configuration is missing.');
        }

        if (!command) return;

        try {
            await command.execute(message, args, client);
        } catch (error) {
            console.error(error);
            const errorEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('Command Error')
                .setDescription(`An error occurred while executing the \`${commandName}\` command.`)
                .addFields({ name: 'Error Details:', value: error.message });

            message.reply({ embeds: [errorEmbed] });
        }
    }
};




async function logCommandCounts() {
    const folders = ['hentai', 'lavalink', 'troll', 'other', 'utility'];
    const basePath = path.join(__dirname, '..', 'excesscommands');
    let totalCommands = 0;

    // Fetch all hentai command settings from MongoDB
    const hentaiSettings = await hentaiCommandCollection.find({ status: true }).toArray();

    const counts = folders.map(folder => {
        const folderPath = path.join(basePath, folder);
        let count = 0;
       
            count = fs.readdirSync(folderPath).filter(file => file.endsWith('.js')).length;
            totalCommands += count;
        

        return { folder, count };
    });

    const maxFolderLength = Math.max(...counts.map(({ folder }) => folder.length));
    const totalCountLength = `Total number of commands: ${totalCommands}`.length;

    const boxWidth = Math.max(maxFolderLength + 34, totalCountLength + 2);

    const line = `└${'─'.repeat(boxWidth - 2)}┘`;
    console.log('┌' + '─'.repeat(boxWidth - 2) + '┐');

    counts.forEach(({ folder, count, status }) => {
        const lineContent = `Folder: ${folder.padEnd(maxFolderLength)} Number of commands: ${status === 'Disabled' ? 'Disabled' : count.toString().padStart(2)}`;
        console.log(`│ ${lineContent.padEnd(boxWidth - 2)} `);
    });

    console.log(`│ Total number of commands: ${totalCommands.toString().padStart(boxWidth - 2)} `);
    console.log(line);
}

logCommandCounts();
