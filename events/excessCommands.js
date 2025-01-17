const { hentaiCommandCollection, serverConfigCollection } = require('../mongodb');
const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../config.json');

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot) return;

        // Fetch hentai settings
        const hentaiSettings = await hentaiCommandCollection.findOne({ serverId: message.guild.id });

        // Fetch server config
        let serverConfig;
        try {
            serverConfig = await serverConfigCollection.findOne({ serverId: message.guild.id });
        } catch (err) {
            console.error('Error fetching server configuration from MongoDB:', err);
        }

        const prefix = serverConfig?.prefix || config.prefix;

        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        // Get all folders in excesscommands directory
        const excessCommandsPath = path.join(__dirname, '..', 'excesscommands');
        let command;

        try {
            // Get all folders in the excesscommands directory
            const commandFolders = fs.readdirSync(excessCommandsPath, { withFileTypes: true })
                .filter(dirent => dirent.isDirectory())
                .map(dirent => dirent.name);

            // Check each folder for the command
            for (const folder of commandFolders) {
                const commandPath = path.join(excessCommandsPath, folder, `${commandName}.js`);
                
                if (fs.existsSync(commandPath)) {
                    // Special handling for hentai commands
                    if (folder === 'hentai') {
                        if (!hentaiSettings?.status) {
                            return message.reply('Hentai commands are currently disabled.');
                        }
                    }

                    // Check if the folder is enabled in config
                    if (config.excessCommands && 
                        (folder === 'hentai' || config.excessCommands[folder])) {
                        command = require(commandPath);
                        break;
                    }
                }
            }
        } catch (error) {
            console.error('Error loading commands:', error);
            return message.reply('Error loading commands.');
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

const colors = require('../UI/colors/colors');

async function logCommandCounts() {
    const basePath = path.join(__dirname, '..', 'excesscommands');
    let totalCommands = 0;

    console.log('\n' + '═'.repeat(60));
    console.log(`${colors.cyan}Current Date and Time (UTC):${colors.reset} ${colors.yellow}2025-01-12 21:02:32${colors.reset}`);
    console.log(`${colors.cyan}Current User's Login:${colors.reset} ${colors.yellow}GlaceYT${colors.reset}`);
    console.log('═'.repeat(60) + '\n');

    // Get all folders dynamically
    const folders = fs.readdirSync(basePath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    // Fetch all hentai command settings from MongoDB
    const hentaiSettings = await hentaiCommandCollection.find({ status: true }).toArray();

    const counts = folders.map(folder => {
        const folderPath = path.join(basePath, folder);
        const count = fs.readdirSync(folderPath)
            .filter(file => file.endsWith('.js')).length;
        totalCommands += count;
        return { folder, count };
    });

    // Fixed width for consistent alignment
    const boxWidth = 50;

    // Header
    console.log(`${colors.magenta}╔${'═'.repeat(boxWidth - 2)}╗${colors.reset}`);
    console.log(`${colors.magenta}║${' '.repeat(boxWidth - 2)}║${colors.reset}`);

    // Display each folder's stats
    counts.forEach(({ folder, count }) => {
        const folderDisplay = `${colors.cyan}${folder}${colors.reset}`;
        const countDisplay = `${colors.green}[${count}]${colors.reset}`;
        const dotsCount = boxWidth - folder.length - count.toString().length - 5; // 5 for brackets and spaces
        const dots = colors.dim + '.'.repeat(dotsCount) + colors.reset;
        
        console.log(`${colors.magenta}║${colors.reset} ${folderDisplay}${dots}${countDisplay} ${colors.magenta}║${colors.reset}`);
    });

    // Separator
    console.log(`${colors.magenta}║${' '.repeat(boxWidth - 2)}║${colors.reset}`);
    console.log(`${colors.magenta}╠${'═'.repeat(boxWidth - 2)}╣${colors.reset}`);
    
    // Summary section with fixed width alignment
    console.log(`${colors.magenta}║${colors.reset} ${colors.bright}Total Commands${colors.reset}${colors.dim}${'·'.repeat(boxWidth - 18)}${colors.reset}${colors.yellow}[${totalCommands}]${colors.reset} ${colors.magenta}║${colors.reset}`);
    console.log(`${colors.magenta}║${colors.reset} ${colors.bright}Active Categories${colors.reset}${colors.dim}${'·'.repeat(boxWidth - 20)}${colors.reset}${colors.yellow}[${counts.length}]${colors.reset} ${colors.magenta}║${colors.reset}`);

    // Footer
    console.log(`${colors.magenta}╚${'═'.repeat(boxWidth - 2)}╝${colors.reset}\n`);
}

logCommandCounts();
