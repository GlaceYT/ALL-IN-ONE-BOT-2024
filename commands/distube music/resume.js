const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const { DisTubeError } = require('distube');
const musicIcons = require('../../UI/icons/musicicons');
const lang = require('../../events/loadLanguage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription(lang.resumeDescription),

    async execute(interaction) {
        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply(lang.resumeNoVoiceChannel);
        }

        const permissions = voiceChannel.permissionsFor(interaction.client.user);
        if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
            return interaction.reply(lang.resumeNoPermissions);
        }

        try {
            await interaction.reply(lang.resumeInProgress);

            // Resume the song
            await interaction.client.distube.resume(voiceChannel);

            const resumedEmbed = new EmbedBuilder()
                .setColor(0x0000FF)
                .setAuthor({ 
                    name: lang.resumeSuccessTitle, 
                    iconURL: musicIcons.pauseresumeIcon,
                    url: "https://discord.gg/xQF9f9yUEM"
                })
                .setFooter({ text: 'Distube Player', iconURL: musicIcons.footerIcon })
                .setDescription(lang.resumeSuccessMessage);

            if (interaction.isCommand && interaction.isCommand()) {
                await interaction.editReply({ embeds: [resumedEmbed] });
            } else {
                await interaction.reply({ embeds: [resumedEmbed] });
            }
        } catch (error) {
            console.error(error);

            if (error instanceof DisTubeError) {
                if (error.code === 'NO_QUEUE') {
                    const noQueueEmbed = new EmbedBuilder()
                        .setColor(0x0000FF)
                        .setAuthor({ 
                            name: lang.resumeNoQueueTitle, 
                            iconURL: musicIcons.wrongIcon,
                            url: "https://discord.gg/xQF9f9yUEM"
                        })
                        .setFooter({ text: 'Distube Player', iconURL: musicIcons.footerIcon })
                        .setDescription(lang.resumeNoQueueMessage);

                    if (interaction.isCommand && interaction.isCommand()) {
                        await interaction.editReply({ embeds: [noQueueEmbed] });
                    } else {
                        await interaction.reply({ embeds: [noQueueEmbed] });
                    }
                } else if (error.code === 'NOT_PAUSED') {
                    const notPausedEmbed = new EmbedBuilder()
                        .setColor(0x0000FF)
                        .setAuthor({ 
                            name: lang.resumeNotPausedTitle, 
                            iconURL: musicIcons.wrongIcon,
                            url: "https://discord.gg/xQF9f9yUEM"
                        })
                        .setFooter({ text: 'Distube Player', iconURL: musicIcons.footerIcon })
                        .setDescription(lang.resumeNotPausedMessage);

                    if (interaction.isCommand && interaction.isCommand()) {
                        await interaction.editReply({ embeds: [notPausedEmbed] });
                    } else {
                        await interaction.reply({ embeds: [notPausedEmbed] });
                    }
                } else if (error.code === 'RESUMED') {
                    const alreadyResumedEmbed = new EmbedBuilder()
                        .setColor(0x0000FF)
                        .setAuthor({ 
                            name: lang.resumeAlreadyResumedTitle, 
                            iconURL: musicIcons.wrongIcon,
                            url: "https://discord.gg/xQF9f9yUEM"
                        })
                        .setFooter({ text: 'Distube Player', iconURL: musicIcons.footerIcon })
                        .setDescription(lang.resumeAlreadyResumedMessage);

                    if (interaction.isCommand && interaction.isCommand()) {
                        await interaction.editReply({ embeds: [alreadyResumedEmbed] });
                    } else {
                        await interaction.reply({ embeds: [alreadyResumedEmbed] });
                    }
                } else {
                    const errorMessage = lang.resumeErrorMessage;
                    if (interaction.isCommand && interaction.isCommand()) {
                        await interaction.editReply(errorMessage);
                    } else {
                        await interaction.reply(errorMessage);
                    }
                }
            } else {
                const errorMessage = lang.resumeErrorMessage;
                if (interaction.isCommand && interaction.isCommand()) {
                    await interaction.editReply(errorMessage);
                } else {
                    await interaction.reply(errorMessage);
                }
            }
        }
    },
};
