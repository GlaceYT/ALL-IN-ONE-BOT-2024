const { prefix } = require('../config.json'); // Load prefix
const shiva = require('../shiva');
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

        // Read the existing config file
        try {
            const data = fs.readFileSync(configPath, 'utf8');
            config = JSON.parse(data);
        } catch (err) {
            console.error('Error reading or parsing config file:', err);
            return message.reply('There was an error reading the configuration.');
        }

        const hentaiStatus = config.hentaicommands && config.hentaicommands[message.guild.id] && config.hentaicommands[message.guild.id].status;

        // Check if command exists and handle based on category
        if (fs.existsSync(path.join(__dirname, '..', 'excesscommands', 'hentai', `${commandName}.js`))) {
            if (!hentaiStatus) return message.reply('Hentai commands are currently disabled.'); // Check if hentai commands are enabled
            command = require(path.join(__dirname, '..', 'excesscommands', 'hentai', `${commandName}.js`));
        } else if (fs.existsSync(path.join(__dirname, '..', 'excesscommands', 'music', `${commandName}.js`))) {
            command = require(path.join(__dirname, '..', 'excesscommands', 'music', `${commandName}.js`));
        } else if (fs.existsSync(path.join(__dirname, '..', 'excesscommands', 'troll', `${commandName}.js`))) {
            command = require(path.join(__dirname, '..', 'excesscommands', 'troll', `${commandName}.js`));
        } else if (fs.existsSync(path.join(__dirname, '..', 'excesscommands', 'other', `${commandName}.js`))) {
            command = require(path.join(__dirname, '..', 'excesscommands', 'other', `${commandName}.js`));
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
    const folders = ['hentai', 'music', 'troll', 'other', 'utility'];
    const basePath = path.join(__dirname, '..', 'excesscommands');
    let totalCommands = 0;

    // Collect folder counts
    const counts = folders.map(folder => {
        const folderPath = path.join(basePath, folder);
        const files = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
        const count = files.length;
        totalCommands += count;
        return { folder, count };
    });

    // Determine the maximum length for folder names and command counts
    const maxFolderLength = Math.max(...counts.map(({ folder }) => folder.length));
    const totalCountLength = `Total commands: ${totalCommands}`.length;
    
    // Set box width to accommodate longest line
    const boxWidth = Math.max(maxFolderLength + 34, totalCountLength + 2);

    const line = `└${'─'.repeat(boxWidth - 2)}┘`;
    console.log('┌' + '─'.repeat(boxWidth - 2) + '┐');

    counts.forEach(({ folder, count }) => {
        const lineContent = `Folder: ${folder.padEnd(maxFolderLength)} Number of commands: ${count.toString().padStart(2)}`;
        console.log(`│ ${lineContent.padEnd(boxWidth - 2)} `);
    });

    console.log(`│ Total number of commands: ${totalCommands.toString().padStart(boxWidth - 2)} `);
    console.log(line);
}

// Call the function to log command counts when the bot starts
logCommandCounts();
