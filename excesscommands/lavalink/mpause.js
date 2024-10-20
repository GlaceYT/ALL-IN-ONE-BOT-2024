const { EmbedBuilder } = require('discord.js');
const musicIcons = require('../../UI/icons/musicicons');
const lang = require('../../events/loadLanguage');

module.exports = {
    name: 'mpause',
    description: lang.mpauseDescription,
    async execute(message) {
        const player = message.client.riffy.get(message.guild.id); 
        if (!player) return message.reply(lang.noMusicPlaying);

        player.pause(true);  
        const pausedEmbed = new EmbedBuilder()
            .setColor('#DC92FF')
            .setAuthor({
                name: lang.songPausedTitle,
                iconURL: musicIcons.pauseresumeIcon,
                url: "https://discord.gg/xQF9f9yUEM"
            })
            .setFooter({ text: lang.footerText, iconURL: musicIcons.footerIcon })
            .setDescription(lang.songPausedDescription);

        message.reply({ embeds: [pausedEmbed] });
    }
};
