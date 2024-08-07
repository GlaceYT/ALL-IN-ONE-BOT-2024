const { EmbedBuilder } = require('discord.js');
const musicIcons = require('../../UI/icons/musicicons');
const lang = require('../../events/loadLanguage');

module.exports = {
    name: 'mshuffle',
    description: lang.mshuffleDescription,
    async execute(message) {
        const player = message.client.manager.get(message.guild.id);
        if (!player) return message.reply(lang.noMusicPlayingError);

        const queue = player.queue;
        if (!queue.length) return message.reply(lang.emptyQueueError);

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
