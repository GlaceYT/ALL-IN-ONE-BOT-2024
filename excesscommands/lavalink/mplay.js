const { EmbedBuilder } = require('discord.js');
const musicIcons = require('../../UI/icons/musicicons');
const lang = require('../../events/loadLanguage');

module.exports = {
    name: 'mplay',
    description: lang.mplayDescription,
    async execute(message, args) {
        const { channel } = message.member.voice;

        if (!channel) return message.reply(lang.joinVoiceChannelError);
        const permissions = channel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT')) return message.reply(lang.connectPermissionError);
        if (!permissions.has('SPEAK')) return message.reply(lang.speakPermissionError);

        const player = message.client.manager.create({
            guild: message.guild.id,
            voiceChannel: channel.id,
            textChannel: message.channel.id,
        });

        if (player.state !== 'CONNECTED') player.connect();

        const search = args.join(' ');
        let res;

        try {
            res = await player.search(search, message.author);
            if (res.loadType === 'LOAD_FAILED') {
                if (!player.queue.current) player.destroy();
                throw new Error(res.exception.message);
            }
        } catch (err) {
            return message.reply(`${lang.searchError} ${err.message}`);
        }

        switch (res.loadType) {
            case 'NO_MATCHES':
                if (!player.queue.current) player.destroy();
                const noMatchesEmbed = new EmbedBuilder()
                    .setColor('#DC92FF')
                    .setFooter({ text: lang.footerText, iconURL: musicIcons.footerIcon })
                    .setAuthor({ name: lang.noResultsTitle, iconURL: musicIcons.wrongIcon });
                return message.reply({ embeds: [noMatchesEmbed] });
            case 'TRACK_LOADED':
                player.queue.add(res.tracks[0]);
                if (!player.playing && !player.paused && !player.queue.size) player.play();
                const trackLoadedEmbed = new EmbedBuilder()
                    .setColor('#DC92FF')
                    .setAuthor({ name: lang.trackEnqueuedTitle, iconURL: musicIcons.correctIcon })
                    .setFooter({ text: lang.footerText, iconURL: musicIcons.footerIcon })
                    .setDescription(`${lang.addingTrack} ${res.tracks[0].title}.`);
                return message.reply({ embeds: [trackLoadedEmbed] });
            case 'PLAYLIST_LOADED':
                player.queue.add(res.tracks);
                if (!player.playing && !player.paused && player.queue.totalSize === res.tracks.length) player.play();
                const playlistLoadedEmbed = new EmbedBuilder()
                    .setColor('#DC92FF')
                    .setAuthor({ name: lang.playlistEnqueuedTitle, iconURL: musicIcons.correctIcon })
                    .setFooter({ text: lang.footerText, iconURL: musicIcons.footerIcon })
                    .setDescription(`${lang.addingPlaylist} ${res.playlist.name} ${lang.withTracks} ${res.tracks.length} ${lang.tracks}.`);
                return message.reply({ embeds: [playlistLoadedEmbed] });
            case 'SEARCH_RESULT':
                player.queue.add(res.tracks[0]);
                if (!player.playing && !player.paused && !player.queue.size) player.play();
                const searchResultEmbed = new EmbedBuilder()
                    .setColor('#DC92FF')
                    .setAuthor({ name: lang.searchResultTitle, iconURL: musicIcons.correctIcon })
                    .setFooter({ text: lang.footerText, iconURL: musicIcons.footerIcon })
                    .setDescription(`${lang.addingTrack} ${res.tracks[0].title}.`);
                return message.reply({ embeds: [searchResultEmbed] });
            default:
                return message.reply(lang.unexpectedError);
        }
    }
};
