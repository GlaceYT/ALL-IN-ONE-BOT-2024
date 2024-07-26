const { EmbedBuilder } = require('discord.js');
const musicIcons = require('../../UI/icons/musicicons'); 


module.exports = {
    name: 'mpause',
    description: 'Pause the current song',
    async execute(message) {
        const player = message.client.manager.get(message.guild.id);
        if (!player) return message.reply('No music is currently being played in this guild.');

        player.pause(true);
        const pausedEmbed = new EmbedBuilder()
                .setColor('#DC92FF')
                .setAuthor({ 
                    name: "Song Paused", 
                    iconURL: musicIcons.pauseresumeIcon ,
                    url: "https://discord.gg/xQF9f9yUEM"
                })
                .setFooter({ text: 'Lavalink Player', iconURL: musicIcons.footerIcon })
                .setDescription('**The current song has been paused.**');
                message.reply({ embeds: [pausedEmbed] });
    }
};
