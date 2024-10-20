const { EmbedBuilder } = require('discord.js');
const musicIcons = require('../../UI/icons/musicicons');
const lang = require('../../events/loadLanguage');

module.exports = {
    name: 'mqueue',
    description: lang.mqueueDescription,
    async execute(message) {
        const player = message.client.riffy.get(message.guild.id);
        if (!player) return message.reply(lang.noMusicPlayingError);

        const queue = player.queue;
        if (!queue || queue.length === 0) return message.reply(lang.queueEmptyError);

        const embeds = [];
        const tracksPerPage = 10;

        for (let i = 0; i < queue.length; i += tracksPerPage) {
            const pageEmbed = new EmbedBuilder()
                .setColor('#DC92FF')
                .setAuthor({
                    name: `${lang.queueTitle} - ${Math.floor(i / tracksPerPage) + 1}`,
                    iconURL: musicIcons.queueIcon
                })
                .setFooter({ text: lang.footerText, iconURL: musicIcons.footerIcon });

            const pageTracks = queue.slice(i, i + tracksPerPage);
            let description = "";
            for (let j = 0; j < pageTracks.length; j++) {
                description += `${i + j + 1}. ${pageTracks[j].info.title} - ${pageTracks[j].info.author}\n`;
            }
            pageEmbed.setDescription(description);

            embeds.push(pageEmbed);
        }

        try {
            await message.channel.send({ embeds });
        } catch (error) {
            console.error('Error sending queue embeds:', error);
            message.reply(lang.queueError);
        }
    }
};
