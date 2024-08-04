const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const musicIcons = require('../../UI/icons/musicicons');
const config = require('../../config.json'); 

module.exports = {
    name: 'mhelp', 
    description: 'List available music commands',
    async execute(message) { 
        const serverId = message.guild.id;
        const serverPrefix = config.prefixes.server_specific[serverId] || config.prefixes.default;

        const musicCommandFolder = './excesscommands/lavalink'; 
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

        let description = ""; 
        for (const file of commandFiles) {
            const command = require(`./${file}`); 
            if (command.name && command.description) {
                description += `**${serverPrefix}${command.name}:** ${command.description}\n`;
            }
        }
        embed.setDescription(description);

        await message.reply({ embeds: [embed] });
    },
};
