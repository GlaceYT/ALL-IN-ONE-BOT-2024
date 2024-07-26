const { prefix } = require('../config.json'); // Load prefix
const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, '..', 'config.json');

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        let command;
        let config;

        try {
            const data = fs.readFileSync(configPath, 'utf8');
            config = JSON.parse(data);
        } catch (err) {
            console.error('Error reading or parsing config file:', err);
            return message.reply('There was an error reading the configuration.');
        }

       
        const hentaiStatus = config.hentaicommands &&
            config.hentaicommands[message.guild.id] &&
            config.hentaicommands[message.guild.id].status;

        
        const globalExcessCommands = config.excessCommands || {};

      
        const getCommandPath = (category, commandName) => {
            return path.join(__dirname, '..', 'excesscommands', category, `${commandName}.js`);
        };

      
        if (fs.existsSync(getCommandPath('hentai', commandName))) {
            if (!hentaiStatus) return message.reply('Hentai commands are currently disabled.');
            command = require(getCommandPath('hentai', commandName));
        } else if (globalExcessCommands.lavalink_music && fs.existsSync(getCommandPath('lavalink music', commandName))) {
            command = require(getCommandPath('lavalink music', commandName));
        } else if (globalExcessCommands.troll && fs.existsSync(getCommandPath('troll', commandName))) {
            command = require(getCommandPath('troll', commandName));
        } else if (globalExcessCommands.other && fs.existsSync(getCommandPath('other', commandName))) {
            command = require(getCommandPath('other', commandName));
        } else if (globalExcessCommands.utility && fs.existsSync(getCommandPath('utility', commandName))) {
            command = require(getCommandPath('utility', commandName));
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
    },
};


function logCommandCounts() {
    const folders = ['hentai', 'lavalink music', 'troll', 'other', 'utility'];
    const basePath = path.join(__dirname, '..', 'excesscommands');
    let totalCommands = 0;

    
    let config;
    try {
        const data = fs.readFileSync(configPath, 'utf8');
        config = JSON.parse(data);
    } catch (err) {
        console.error('Error reading or parsing config file:', err);
        return;
    }

  
    const counts = folders.map(folder => {
        const folderPath = path.join(basePath, folder);
        let count = 0;
        let status = 'Disabled';

        if (folder === 'hentai') {
            
            const hentaiStatus = config.hentaicommands && Object.values(config.hentaicommands).some(guild => guild.status);
            if (hentaiStatus) {
                status = 'Enabled';
                count = fs.readdirSync(folderPath).filter(file => file.endsWith('.js')).length;
                totalCommands += count;
            }
        } else if (config.excessCommands[folder]) {
            status = 'Enabled';
            count = fs.readdirSync(folderPath).filter(file => file.endsWith('.js')).length;
            totalCommands += count;
        }

        return { folder, count, status };
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
