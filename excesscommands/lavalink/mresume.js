const { EmbedBuilder } = require('discord.js');
const musicIcons = require('../../UI/icons/musicicons');
const lang = require('../../events/loadLanguage');

module.exports = {
    name: 'mresume',
    description: lang.mresumeDescription,
    async execute(message) {
        const player = message.client.riffy.get(message.guild.id);
        if (!player) return message.reply(lang.noMusicPlayingError);

        player.pause(false);  
        const resumedEmbed = new EmbedBuilder()
            .setColor('#DC92FF')
            .setAuthor({ 
                name: lang.songResumedTitle, 
                iconURL: musicIcons.pauseresumeIcon,
                url: "https://discord.gg/xQF9f9yUEM"
            })
            .setFooter({ text: lang.footerText, iconURL: musicIcons.footerIcon })
            .setDescription(lang.songResumedText);

        message.reply({ embeds: [resumedEmbed] });
    }
};