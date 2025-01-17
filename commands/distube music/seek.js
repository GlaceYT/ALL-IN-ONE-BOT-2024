const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const { DisTubeError } = require('distube');
const musicIcons = require('../../UI/icons/musicicons');
const cmdIcons = require('../../UI/icons/commandicons');
const lang = require('../../events/loadLanguage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('seek')
        .setDescription(lang.seekDescription)
        .addStringOption(option =>
            option.setName('timestamp')
                .setDescription(lang.seekTimestampDescription)
                .setRequired(true)),

    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) {
            await interaction.deferReply();
            const timestamp = interaction.options.getString('timestamp');
            await this.handleSeekCommand(interaction, timestamp);
        } else {
            const embed = new EmbedBuilder()
                .setColor(0x0000FF)
                .setAuthor({ 
                    name: lang.seekAlertTitle, 
                    iconURL: cmdIcons.dotIcon,
                    url: "https://discord.gg/xQF9f9yUEM"
                })
                .setDescription(lang.seekAlertMessage)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        }
    },

    async handleSeekCommand(source, timestamp) {
        try {
            const voiceChannel = source.member.voice.channel;

            if (!voiceChannel) {
                return source.channel.send(lang.seekNoVoiceChannel);
            }

            const permissions = voiceChannel.permissionsFor(source.client.user);
            if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
                return source.channel.send(lang.seekNoPermissions);
            }

            // Validate seek time format (either seconds or mm:ss)
            const seekSeconds = this.parseSeekTime(timestamp);
            if (seekSeconds === -1) {
                return source.channel.send(lang.seekInvalidFormat);
            }

            await source.channel.send(lang.seekInProgress);

            // Seek to the specified time
            await source.client.distube.seek(voiceChannel, seekSeconds);

            const seekEmbed = new EmbedBuilder()
                .setColor(0x0000FF)
                .setAuthor({ 
                    name: lang.seekSuccessTitle, 
                    iconURL: musicIcons.correctIcon,
                    url: "https://discord.gg/xQF9f9yUEM"
                })
                .setFooter({ text: 'Distube Player', iconURL: musicIcons.footerIcon })
                .setDescription(lang.seekSuccessMessage.replace('%timestamp%', this.formatTimestamp(seekSeconds)));

            await source.channel.send({ embeds: [seekEmbed] });

        } catch (error) {
            console.error(error);

            if (error instanceof DisTubeError && error.code === 'NO_QUEUE') {
                const noQueueEmbed = new EmbedBuilder()
                    .setColor(0x0000FF)
                    .setAuthor({ 
                        name: lang.seekNoQueueTitle, 
                        iconURL: musicIcons.wrongIcon,
                        url: "https://discord.gg/xQF9f9yUEM"
                    })
                    .setFooter({ text: 'Distube Player', iconURL: musicIcons.footerIcon })
                    .setDescription(lang.seekNoQueueMessage);

                await source.channel.send({ embeds: [noQueueEmbed] });
            } else {
                const errorMessage = lang.seekErrorMessage;
                await source.channel.send(errorMessage);
            }
        }
    },

    parseSeekTime(timeString) {
        const timeRegex = /^(\d+):(\d+)$/;
        if (timeRegex.test(timeString)) {
            const match = timeString.match(timeRegex);
            const minutes = parseInt(match[1], 10);
            const seconds = parseInt(match[2], 10);
            return minutes * 60 + seconds;
        } else if (!isNaN(timeString)) {
            return parseInt(timeString, 10);
        } else {
            return -1;
        }
    },

    formatTimestamp(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }
};
