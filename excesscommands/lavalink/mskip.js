const { EmbedBuilder } = require('discord.js');
const musicIcons = require('../../UI/icons/musicicons');
const lang = require('../../events/loadLanguage');

module.exports = {
    name: 'mskip',
    description: lang.mskipDescription,
    async execute(message) {
        const player = message.client.manager.get(message.guild.id);
        if (!player) return message.reply(lang.noMusicPlayingError);

        const currentTrack = player.queue.current;
        player.stop();

        let nextSongEmbed;
        if (player.queue.size > 0) {
            const nextTrack = player.queue[0];
            nextSongEmbed = new EmbedBuilder()
                .setColor('#DC92FF')
                .setAuthor({
                    name: lang.songSkippedTitle,
                    iconURL: musicIcons.skipIcon,
                    url: "https://discord.gg/xQF9f9yUEM"
                })
                .setFooter({ text: lang.footerText, iconURL: musicIcons.footerIcon })
                .setDescription(`${lang.playingNextSongText}\n\n **${nextTrack.title}**`);
        } else {
            nextSongEmbed = new EmbedBuilder()
                .setColor('#DC92FF')
                .setAuthor({
                    name: lang.noSongsTitle,
                    iconURL: musicIcons.skipIcon,
                    url: "https://discord.gg/xQF9f9yUEM"
                })
                .setFooter({ text: lang.footerText, iconURL: musicIcons.footerIcon })
                .setDescription(lang.noMoreTracksText);
        }
        message.reply({ embeds: [nextSongEmbed] });
    }
};
