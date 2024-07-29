const { EmbedBuilder } = require('discord.js');
const musicIcons = require('../../UI/icons/musicicons'); 

module.exports = {
    name: 'mresume',
    description: 'Resume the paused song',
    async execute(message) {
        const player = message.client.manager.get(message.guild.id);
        if (!player) return message.reply('No music is currently being played in this guild.');

        player.pause(false);
        const resumedEmbed = new EmbedBuilder()
                .setColor('#DC92FF')
                .setAuthor({ 
                    name: "Song Resumed", 
                    iconURL: musicIcons.pauseresumeIcon ,
                    url: "https://discord.gg/xQF9f9yUEM"
                })
                .setFooter({ text: 'Lavalink player', iconURL: musicIcons.footerIcon })
                .setDescription('**The paused song has been resumed.**');

                message.reply({ embeds: [resumedEmbed] });
    }
};
