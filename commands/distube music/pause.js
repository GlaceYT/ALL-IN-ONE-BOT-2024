const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const { DisTubeError } = require('distube');
const musicIcons = require('../../UI/icons/musicicons');
const lang = require('../../events/loadLanguage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription(lang.pauseDescription),

    async execute(interaction) {
        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply(lang.pauseNoVoiceChannel);
        }

        const permissions = voiceChannel.permissionsFor(interaction.client.user);
        if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
            return interaction.reply(lang.pauseNoPermissions);
        }

        try {
            await interaction.reply(lang.pauseInProgress);

            // Pause the song
            await interaction.client.distube.pause(voiceChannel);

            const pausedEmbed = new EmbedBuilder()
                .setColor(0x0000FF)
                .setAuthor({ 
                    name: lang.pauseTitle, 
                    iconURL: musicIcons.pauseresumeIcon,
                    url: "https://discord.gg/xQF9f9yUEM"
                })
                .setFooter({ text: lang.pauseFooterText, iconURL: musicIcons.footerIcon })
                .setDescription(lang.pauseSuccess);
                
            if (interaction.isCommand && interaction.isCommand()) {
                await interaction.editReply({ embeds: [pausedEmbed] });
            } else {
                await interaction.reply({ embeds: [pausedEmbed] });
            }
        } catch (error) {
            console.error(error);

            if (error instanceof DisTubeError) {
                let embed;
                switch (error.code) {
                    case 'NO_QUEUE':
                        embed = new EmbedBuilder()
                            .setColor(0x0000FF)
                            .setAuthor({ 
                                name: lang.pauseNoQueueTitle, 
                                iconURL: musicIcons.wrongIcon,
                                url: "https://discord.gg/xQF9f9yUEM"
                            })
                            .setFooter({ text: lang.pauseFooterText, iconURL: musicIcons.footerIcon })
                            .setDescription(lang.pauseNoQueue);
                        break;
                    case 'NOT_PAUSED':
                        embed = new EmbedBuilder()
                            .setColor(0x0000FF)
                            .setAuthor({ 
                                name: lang.pauseNotPausedTitle, 
                                iconURL: musicIcons.wrongIcon,
                                url: "https://discord.gg/xQF9f9yUEM"
                            })
                            .setFooter({ text: lang.pauseFooterText, iconURL: musicIcons.footerIcon })
                            .setDescription(lang.pauseNotPaused);
                        break;
                    case 'PAUSED':
                        embed = new EmbedBuilder()
                            .setColor(0x0000FF)
                            .setAuthor({ 
                                name: lang.pauseAlreadyPausedTitle, 
                                iconURL: musicIcons.wrongIcon,
                                url: "https://discord.gg/xQF9f9yUEM"
                            })
                            .setFooter({ text: lang.pauseFooterText, iconURL: musicIcons.footerIcon })
                            .setDescription(lang.pauseAlreadyPaused);
                        break;
                    default:
                        embed = new EmbedBuilder()
                            .setColor(0x0000FF)
                            .setAuthor({ 
                                name: lang.pauseErrorTitle, 
                                iconURL: musicIcons.wrongIcon,
                                url: "https://discord.gg/xQF9f9yUEM"
                            })
                            .setFooter({ text: lang.pauseFooterText, iconURL: musicIcons.footerIcon })
                            .setDescription(lang.pauseError);
                        break;
                }

                if (interaction.isCommand && interaction.isCommand()) {
                    await interaction.editReply({ embeds: [embed] });
                } else {
                    await interaction.reply({ embeds: [embed] });
                }
            } else {
                const errorMessage = lang.pauseError;
                if (interaction.isCommand && interaction.isCommand()) {
                    await interaction.editReply(errorMessage);
                } else {
                    await interaction.reply(errorMessage);
                }
            }
        }
    },
};
