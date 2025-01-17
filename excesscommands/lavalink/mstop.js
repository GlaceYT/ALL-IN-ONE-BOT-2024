const { EmbedBuilder } = require('discord.js');
const musicIcons = require('../../UI/icons/musicicons');
const lang = require('../../events/loadLanguage');

module.exports = {
    name: 'mstop',
    description: lang.mstopDescription,
    async execute(message) {
        const player = message.client.riffy.get(message.guild.id); 
        if (!player) return message.reply(lang.noMusicPlayingError);


        player.destroy();  

        const stoppedEmbed = new EmbedBuilder()
            .setColor('#DC92FF')
            .setAuthor({
                name: lang.stoppedTitle,
                iconURL: musicIcons.stopIcon,
                url: "https://discord.gg/xQF9f9yUEM"
            })
            .setFooter({ text: lang.footerText, iconURL: musicIcons.footerIcon })
            .setDescription(lang.queueStoppedText);
        
        message.reply({ embeds: [stoppedEmbed] }); 
    }
};