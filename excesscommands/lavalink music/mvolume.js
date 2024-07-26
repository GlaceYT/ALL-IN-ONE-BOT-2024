const { EmbedBuilder } = require('discord.js');
const musicIcons = require('../../UI/icons/musicicons'); 

module.exports = {
    name: 'mvolume',
    description: 'Adjust the volume of the music',
    async execute(message, args) {
        const player = message.client.manager.get(message.guild.id);
        if (!player) return message.reply('No music is currently being played in this guild.');

        const volumeEmbed = new EmbedBuilder()
            .setColor('#DC92FF'); 

        if (!args[0]) {
            volumeEmbed
                .setAuthor({ 
                    name: 'Volume Control', 
                    iconURL: musicIcons.volumeIcon,
                    url: "https://discord.gg/xQF9f9yUEM" 
                })
                .setFooter({ text: 'Lavalink Player', iconURL: musicIcons.footerIcon })
                .setDescription(`**Current volume: ${player.volume}%**`);
            return message.reply({ embeds: [volumeEmbed] });
        }

        if (isNaN(args[0])) return message.reply('**Please provide a valid number.**');

        const volume = Math.max(Math.min(parseInt(args[0]), 100), 0);
        player.setVolume(volume);

        volumeEmbed
            .setAuthor({ 
                name: 'Volume Control', 
                iconURL: musicIcons.volumeIcon,
                url: "https://discord.gg/xQF9f9yUEM" 
            })
            .setFooter({ text: 'Lavalink Player', iconURL: musicIcons.footerIcon })
            .setDescription(`**Volume set to ${volume}%**`);
        message.reply({ embeds: [volumeEmbed] });
    }
};
