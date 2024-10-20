const { EmbedBuilder } = require('discord.js');
const musicIcons = require('../../UI/icons/musicicons');
const lang = require('../../events/loadLanguage');

module.exports = {
    name: 'mremove',
    description: lang.mremoveDescription,
    async execute(message, args) {
        const player = message.client.riffy.get(message.guild.id);
        if (!player) return message.reply(lang.noMusicPlayingError);

        const index = parseInt(args[0]);
        if (isNaN(index) || index < 1 || index > player.queue.length) {
            return message.reply(lang.invalidTrackNumberError);
        }

      
        const removed = player.queue.remove(index - 1);
        const removeEmbed = new EmbedBuilder()
            .setColor('#DC92FF')
            .setAuthor({
                name: lang.removedSongTitle,
                iconURL: musicIcons.skipIcon,
                url: "https://discord.gg/xQF9f9yUEM"
            })
            .setFooter({ text: lang.footerText, iconURL: musicIcons.footerIcon })
            .setDescription(`${lang.removedSongText} **${removed[0].info.title}**`);

        message.reply({ embeds: [removeEmbed] });
    }
};