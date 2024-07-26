const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const musicIcons = require('../../UI/icons/musicicons');
const { prefix } = require('../../config.json'); // Assuming you have a config file for your prefix

module.exports = {
    name: 'mhelp', 
    description: 'List available music commands',
    async execute(message) { 

        const musicCommandFolder = './excesscommands/music'; 
        const commandFiles = fs.readdirSync(musicCommandFolder).filter(file => file.endsWith('.js'));

        if (commandFiles.length === 0) {
            return message.reply('No music commands found.'); 
        }

        const embed = new EmbedBuilder()
            .setColor('#DC92FF')
            .setAuthor({ 
                name: "Lavalink Player Commands", 
                iconURL: musicIcons.beatsIcon,
                url: "https://discord.gg/xQF9f9yUEM"
            })
            .setFooter({ text: 'Lavalink Player', iconURL: musicIcons.footerIcon });

        let description = ""; // Initialize an empty description string
        for (const file of commandFiles) {
            const command = require(`./${file}`); 
            if (command.name && command.description) {
                description += `**${prefix}${command.name}:** ${command.description}\n`;
            }
        }
        embed.setDescription(description);

        await message.reply({ embeds: [embed] });
    },
};
