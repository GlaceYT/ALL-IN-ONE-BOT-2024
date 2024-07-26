const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { DisTubeError } = require('distube');
const musicIcons = require('../../UI/icons/musicicons');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('Show the currently playing song'),

    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) {
            await interaction.deferReply();
        }

        await this.executeNowPlaying(interaction);
    },

    async executePrefix(message) {
        await this.executeNowPlaying(message);
    },

    async executeNowPlaying(source) {
        try {
            const voiceChannel = source.member.voice.channel;

            if (!voiceChannel) {
                return source.channel.send('**You need to be in a voice channel to see what\'s playing!**');
            }

            const permissions = voiceChannel.permissionsFor(source.client.user);
            if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
                return source.channel.send('I need the permissions to join and speak in your voice channel!');
            }

           
            const queue = source.client.distube.getQueue(source.guildId);
            if (!queue || !queue.playing) {
                const noSongEmbed = new EmbedBuilder()
                    .setColor('#DC92FF')
                    .setAuthor({ 
                        name: "Oops!", 
                        iconURL: musicIcons.wrongIcon ,
                         url: "https://discord.gg/xQF9f9yUEM"
                        })
                    .setFooter({ text: 'MUSIC PLAYER - Distube', iconURL: musicIcons.footerIcon })   
                    .setDescription('There is no song currently playing.');

                return source.channel.send({ embeds: [noSongEmbed] });
            }

            const currentSong = queue.songs[0];
            const nowPlayingEmbed = new EmbedBuilder()
                .setColor('#DC92FF')
                .setAuthor({ 
                    name: "Now Playing..", 
                    iconURL: musicIcons.playerIcon,
                     url: "https://discord.gg/xQF9f9yUEM"
                    })
                .setDescription(`- **Here the information about current playing song.**\n[${currentSong.name}](${currentSong.url})`)
                .setFooter({ text: 'MUSIC PLAYER - Distube', iconURL: musicIcons.footerIcon })
                .addFields(
                    { name: 'Duration', value: currentSong.formattedDuration },
                    { name: 'Requested by', value: currentSong.user.username }
                );

            return source.channel.send({ embeds: [nowPlayingEmbed] });
        } catch (error) {
            console.error(error);

            if (error instanceof DisTubeError && error.code === 'NO_QUEUE') {
                const noQueueEmbed = new EmbedBuilder()
                    .setColor('#DC92FF')
                    .setAuthor({ 
                        name: "Oops!", 
                        iconURL: musicIcons.wrongIcon ,
                         url: "https://discord.gg/xQF9f9yUEM"
                        })
                    .setFooter({ text: 'MUSIC PLAYER - Distube', iconURL: musicIcons.footerIcon })   
                    .setDescription('**There is no playing queue in this guild.**');

                return source.channel.send({ embeds: [noQueueEmbed] });
            } else {
                const errorMessage = 'An error occurred while fetching the current song.';
                return source.channel.send(errorMessage);
            }
        }
    },
};
