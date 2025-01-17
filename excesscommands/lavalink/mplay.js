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

        let player = message.client.riffy.players.get(message.guild.id);
        if (!player) {
            try {
                player = await message.client.riffy.createConnection({
                    guildId: message.guild.id,
                    voiceChannel: channel.id,
                    textChannel: message.channel.id,
                    deaf: true
                });
            } catch (error) {
                console.error('Error creating player:', error);
                return message.reply(lang.voiceConnectionError);
            }
        }

   
        const query = args.join(' ');
        if (!query) return message.reply(lang.queryMissingError);

   
        let resolve;
        try {
            resolve = await message.client.riffy.resolve({
                query,
                requester: message.author
            });

            const { loadType, tracks, playlistInfo } = resolve;

            if (!tracks || tracks.length === 0) {
                return message.reply(lang.noResultsError);
            }

            switch (loadType) {
                case 'playlist':
                    for (const track of tracks) {
                        track.info.requester = message.author;
                        player.queue.add(track);
                    }

                    const playlistEmbed = new EmbedBuilder()
                        .setColor('#DC92FF')
                        .setAuthor({ name: lang.playlistEnqueuedTitle, iconURL: musicIcons.correctIcon })
                        .setFooter({ text: lang.footerText, iconURL: musicIcons.footerIcon })
                        .setDescription(`${lang.addingPlaylist} ${playlistInfo.name} ${lang.withTracks} ${tracks.length} ${lang.tracks}.`);

                    message.reply({ embeds: [playlistEmbed] });

                    if (!player.playing && !player.paused) player.play();
                    break;

                case 'track':
                case 'search':
                    const track = tracks[0]; 
                    track.info.requester = message.author;
                    player.queue.add(track);

                    const trackEmbed = new EmbedBuilder()
                        .setColor('#DC92FF')
                        .setAuthor({ name: lang.trackEnqueuedTitle, iconURL: musicIcons.correctIcon })
                        .setFooter({ text: lang.footerText, iconURL: musicIcons.footerIcon })
                        .setDescription(`${lang.addingTrack} ${track.info.title}.`);

                    message.reply({ embeds: [trackEmbed] });

                    if (!player.playing && !player.paused) player.play();
                    break;

                default:
                    message.reply(lang.noResultsError);
            }

        } catch (error) {
            console.error('Error resolving query:', error);
            return message.reply(`${lang.searchError} ${error.message}`);
        }
    }
};
