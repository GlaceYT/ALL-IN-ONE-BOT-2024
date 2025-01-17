const { EmbedBuilder } = require('discord.js');
const musicIcons = require('../../UI/icons/musicicons');
const lang = require('../../events/loadLanguage');

module.exports = {
    name: 'mshuffle',
    description: lang.mshuffleDescription,
    async execute(message) {
        const player = message.client.riffy.get(message.guild.id);
        if (!player) return message.reply(lang.noMusicPlayingError);

        const queue = player.queue;
        if (!queue || queue.length === 0) return message.reply(lang.emptyQueueError);

        // Shuffle the queue
        player.queue.shuffle();

        const shuffleEmbed = new EmbedBuilder()
            .setColor('#DC92FF')
            .setAuthor({
                name: lang.queueUpdateTitle,
                iconURL: musicIcons.correctIcon
            })
            .setDescription(lang.queueShuffledText)
            .setFooter({ text: lang.footerText, iconURL: musicIcons.footerIcon });

        message.reply({ embeds: [shuffleEmbed] });
    }
};