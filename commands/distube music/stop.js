const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { DisTubeError } = require('distube');
const musicIcons = require('../../UI/icons/musicicons');
const lang = require('../../events/loadLanguage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription(lang.stopDescription),

    async execute(interaction) {
        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply(lang.stopNoVoiceChannel);
        }

        const permissions = voiceChannel.permissionsFor(interaction.client.user);
        if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
            return interaction.reply(lang.stopNoPermissions);
        }

        try {
            await interaction.reply(lang.stopInProgress);

            // Stop the queue and leave voice channel
            await interaction.client.distube.stop(voiceChannel);

            const stoppedEmbed = new EmbedBuilder()
                .setColor(0x0000FF)
                .setAuthor({ 
                    name: lang.stopSuccessTitle, 
                    iconURL: musicIcons.stopIcon,
                    url: "https://discord.gg/xQF9f9yUEM"
                })
                .setFooter({ text: 'Distube Player', iconURL: musicIcons.footerIcon })   
                .setDescription(lang.stopSuccessMessage);

            await interaction.reply({ embeds: [stoppedEmbed] });
        } catch (error) {
            console.error(error);

            if (error instanceof DisTubeError && error.code === 'NO_QUEUE') {
                const noQueueEmbed = new EmbedBuilder()
                    .setColor(0x0000FF)
                    .setAuthor({ 
                        name: lang.stopNoQueueTitle, 
                        iconURL: musicIcons.wrongIcon,
                        url: "https://discord.gg/xQF9f9yUEM"
                    })
                    .setFooter({ text: 'Distube Player', iconURL: musicIcons.footerIcon })   
                    .setDescription(lang.stopNoQueueMessage);

                await interaction.reply({ embeds: [noQueueEmbed] });
            } else if (error instanceof DisTubeError && error.code === 'STOPPED') {
                const alreadyStoppedEmbed = new EmbedBuilder()
                    .setColor(0x0000FF)
                    .setAuthor({ 
                        name: lang.stopAlreadyStoppedTitle, 
                        iconURL: musicIcons.wrongIcon,
                        url: "https://discord.gg/xQF9f9yUEM"
                    })
                    .setFooter({ text: 'Distube Player', iconURL: musicIcons.footerIcon })   
                    .setDescription(lang.stopAlreadyStoppedMessage);

                await interaction.reply({ embeds: [alreadyStoppedEmbed] });
            } else {
                const errorMessage = lang.stopErrorMessage;
                await interaction.reply(errorMessage);
            }
        }
    },
};
