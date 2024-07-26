const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { DisTubeError } = require('distube');
const musicIcons = require('../../UI/icons/musicicons'); 
module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause the current song'),

    async execute(interaction) {
        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply('**You need to be in a voice channel to pause music!**');
        }

        const permissions = voiceChannel.permissionsFor(interaction.client.user);
        if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
            return interaction.reply('I need the permissions to join and speak in your voice channel!');
        }

        try {
            await interaction.reply('**Pausing the current song...**');

            // Pause the song
            await interaction.client.distube.pause(voiceChannel);

            const pausedEmbed = new EmbedBuilder()
                .setColor('#DC92FF')
                .setAuthor({ 
                    name: "Song Paused", 
                    iconURL: musicIcons.pauseresumeIcon ,
                    url: "https://discord.gg/xQF9f9yUEM"
                })
                .setFooter({ text: 'MUSIC PLAYER - Distube', iconURL: musicIcons.footerIcon })
                .setDescription('**The current song has been paused.**');
            if (interaction.isCommand && interaction.isCommand()) {
                await interaction.editReply({ embeds: [pausedEmbed] });
            } else {
                await interaction.reply({ embeds: [pausedEmbed] });
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
                    .setDescription('**No song playing in the guild.**');

                if (interaction.isCommand && interaction.isCommand()) {
                    await interaction.editReply({ embeds: [noQueueEmbed] });
                } else {
                    await interaction.reply({ embeds: [noQueueEmbed] });
                }
            } else if (error instanceof DisTubeError && error.code === 'NOT_PAUSED') {
                const notPausedEmbed = new EmbedBuilder()
                    .setColor('#DC92FF')
                    .setAuthor({ 
                        name: "Oops!", 
                        iconURL: musicIcons.wrongIcon ,
                         url: "https://discord.gg/xQF9f9yUEM"
                        })
                    .setFooter({ text: 'MUSIC PLAYER - Distube', iconURL: musicIcons.footerIcon })    
                    .setDescription('**The music player is not paused.**');

                if (interaction.isCommand && interaction.isCommand()) {
                    await interaction.editReply({ embeds: [notPausedEmbed] });
                } else {
                    await interaction.reply({ embeds: [notPausedEmbed] });
                }
            } else if (error instanceof DisTubeError && error.code === 'PAUSED') {
                const alreadyPausedEmbed = new EmbedBuilder()
                    .setColor('#DC92FF')
                    .setAuthor({ 
                        name: "Oops!", 
                        iconURL: musicIcons.wrongIcon ,
                         url: "https://discord.gg/xQF9f9yUEM"
                        })
                    .setFooter({ text: 'MUSIC PLAYER - Distube', iconURL: musicIcons.footerIcon })    
                    .setDescription('**The music player is already paused.**');

                if (interaction.isCommand && interaction.isCommand()) {
                    await interaction.editReply({ embeds: [alreadyPausedEmbed] });
                } else {
                    await interaction.reply({ embeds: [alreadyPausedEmbed] });
                }
            } else {
                const errorMessage = 'An error occurred while trying to pause the song.';
                if (interaction.isCommand && interaction.isCommand()) {
                    await interaction.editReply(errorMessage);
                } else {
                    await interaction.reply(errorMessage);
                }
            }
        }
    },
};
