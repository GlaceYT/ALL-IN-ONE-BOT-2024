const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { DisTubeError } = require('distube');
const musicIcons = require('../../UI/icons/musicicons');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop the current queue and leave the voice channel'),

    async execute(interaction) {
        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply('**You need to be in a voice channel to stop music!**');
        }

        const permissions = voiceChannel.permissionsFor(interaction.client.user);
        if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
            return interaction.reply('**I need the permissions to join and speak in your voice channel!**');
        }

        try {
            await interaction.reply('**Stopping the queue and leaving the channel...**');

            // Stop the queue and leave voice channel
            await interaction.client.distube.stop(voiceChannel);

            const stoppedEmbed = new EmbedBuilder()
                .setColor('#DC92FF')
                .setAuthor({ 
                    name: "Stopped!", 
                    iconURL: musicIcons.stopIcon ,
                     url: "https://discord.gg/xQF9f9yUEM"
                    })
                .setFooter({ text: 'MUSIC PLAYER - Distube', iconURL: musicIcons.footerIcon })   
                .setDescription('**The queue has been stopped**');

            if (interaction.isCommand && interaction.isCommand()) {
                await interaction.editReply({ embeds: [stoppedEmbed] });
            } else {
                await interaction.reply({ embeds: [stoppedEmbed] });
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
            } else if (error instanceof DisTubeError && error.code === 'STOPPED') {
                const alreadyStoppedEmbed = new EmbedBuilder()
                    .setColor('#DC92FF')
                    .setAuthor({ 
                        name: "Oops!", 
                        iconURL: musicIcons.wrongIcon ,
                         url: "https://discord.gg/xQF9f9yUEM"
                        })
                    .setFooter({ text: 'MUSIC PLAYER - Distube', iconURL: musicIcons.footerIcon })   
                    .setDescription('**The queue is already stopped.**');

                if (interaction.isCommand && interaction.isCommand()) {
                    await interaction.editReply({ embeds: [alreadyStoppedEmbed] });
                } else {
                    await interaction.reply({ embeds: [alreadyStoppedEmbed] });
                }
            } else {
                const errorMessage = 'An error occurred while trying to stop the queue.';
                if (interaction.isCommand && interaction.isCommand()) {
                    await interaction.editReply(errorMessage);
                } else {
                    await interaction.reply(errorMessage);
                }
            }
        }
    },
};
