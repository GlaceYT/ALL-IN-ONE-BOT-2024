const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { DisTubeError } = require('distube');
const musicIcons = require('../../UI/icons/musicicons');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip the current song in the queue'),

    async execute(interaction) {
        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply('**You need to be in a voice channel to skip music!**');
        }

        const permissions = voiceChannel.permissionsFor(interaction.client.user);
        if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
            return interaction.reply('**I need the permissions to join and speak in your voice channel!**');
        }

        try {
            await interaction.reply('**Skipping the current song...**');

            // Skip the song
            await interaction.client.distube.skip(voiceChannel);

            // Check if there are songs left in the queue
            const queue = interaction.client.distube.getQueue(interaction.guildId);
            if (!queue || !queue.songs.length) {
                const noSongsEmbed = new EmbedBuilder()
                    .setColor('#DC92FF')
                    .setAuthor({ 
                        name: "Oops!", 
                        iconURL: musicIcons.wrongIcon ,
                         url: "https://discord.gg/xQF9f9yUEM"
                        })
                .setFooter({ text: 'MUSIC PLAYER - Distube', iconURL: musicIcons.footerIcon })   
                    .setDescription('**No more songs in the queue.**');

                if (interaction.isCommand && interaction.isCommand()) {
                    return interaction.editReply({ embeds: [noSongsEmbed] });
                } else {
                    return interaction.reply({ embeds: [noSongsEmbed] });
                }
            }

            // Get the next song
            const nextSong = queue.songs[0];
            const nextSongEmbed = new EmbedBuilder()
                .setColor('#DC92FF')
                .setAuthor({ 
                    name: "Song Skipped", 
                    iconURL: musicIcons.skipIcon ,
                     url: "https://discord.gg/xQF9f9yUEM"
                    })
                .setFooter({ text: 'MUSIC PLAYER - Distube', iconURL: musicIcons.footerIcon })  
                .addFields(
                    { name: 'Title', value: nextSong.name },
                    { name: 'Duration', value: nextSong.formattedDuration }
                );

            if (interaction.isCommand && interaction.isCommand()) {
                await interaction.editReply({ embeds: [nextSongEmbed] });
            } else {
                await interaction.reply({ embeds: [nextSongEmbed] });
            }
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

                if (interaction.isCommand && interaction.isCommand()) {
                    await interaction.editReply({ embeds: [noQueueEmbed] });
                } else {
                    await interaction.reply({ embeds: [noQueueEmbed] });
                }
            } else {
                const errorMessage = 'An error occurred while trying to skip the song.';
                if (interaction.isCommand && interaction.isCommand()) {
                    await interaction.editReply(errorMessage);
                } else {
                    await interaction.reply(errorMessage);
                }
            }
        }
    },
};
