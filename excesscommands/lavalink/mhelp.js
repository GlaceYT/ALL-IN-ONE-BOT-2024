const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const musicIcons = require('../../UI/icons/musicicons');
const config = require('../../config.json'); 
const { serverConfigCollection } = require('../../mongodb'); 
const lang = require('../../events/loadLanguage');

module.exports = {
    name: 'mhelp', 
    description: lang.mhelpDescription,
    async execute(message) { 
        const serverId = message.guild.id;

        let serverConfig;
        try {
            serverConfig = await serverConfigCollection.findOne({ serverId });
        } catch (err) {
            console.error('Error fetching server configuration from MongoDB:', err);
        }

        const serverPrefix = serverConfig && serverConfig.prefix ? serverConfig.prefix : config.prefix;

        const musicCommandFolder = './excesscommands/lavalink'; 
        const commandFiles = fs.readdirSync(musicCommandFolder).filter(file => file.endsWith('.js'));

        if (commandFiles.length === 0) {
            return message.reply(lang.noCommandsFound); 
        }

        const embed = new EmbedBuilder()
            .setColor('#DC92FF')
            .setAuthor({ 
                name: lang.lavalinkCommandsTitle, 
                iconURL: musicIcons.beatsIcon,
                url: "https://discord.gg/xQF9f9yUEM"
            })
            .setFooter({ text: lang.lavalinkPlayerFooter, iconURL: musicIcons.footerIcon });

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
