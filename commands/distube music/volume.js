const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const musicIcons = require('../../UI/icons/musicicons');
const cmdIcons = require('../../UI/icons/commandicons');
const lang = require('../../events/loadLanguage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription(lang.volumeDescription)
        .addIntegerOption(option =>
            option.setName('level')
                .setDescription(lang.volumeLevelDescription)
                .setRequired(true)),

    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) {
            await interaction.deferReply();
            const volumeLevel = interaction.options.getInteger('level');
            await this.setVolume(interaction, volumeLevel);
        } else {
            const embed = new EmbedBuilder()
                .setColor('#3498db')
                .setAuthor({
                    name: lang.volumeAlertTitle,
                    iconURL: cmdIcons.dotIcon,
                    url: "https://discord.gg/xQF9f9yUEM"
                })
                .setDescription(lang.volumeAlertMessage)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        }
    },

    async setVolume(source, volumeLevel) {
        try {
            const voiceChannel = source.member.voice.channel;

            if (!voiceChannel) {
                return source.channel.send(lang.volumeNoVoiceChannel);
            }

            const permissions = voiceChannel.permissionsFor(source.client.user);
            if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
                return source.channel.send(lang.volumeNoPermissions);
            }

            const queue = source.client.distube.getQueue(source.guildId);
            if (!queue || !queue.playing) {
                const noSongEmbed = new EmbedBuilder()
                    .setColor(0x0000FF)
                    .setAuthor({
                        name: lang.volumeNoSongTitle,
                        iconURL: musicIcons.wrongIcon,
                        url: "https://discord.gg/xQF9f9yUEM"
                    })
                    .setFooter({ text: 'DisTube Player', iconURL: musicIcons.footerIcon })
                    .setDescription(lang.volumeNoSongMessage);

                return source.channel.send({ embeds: [noSongEmbed] });
            }

            queue.setVolume(volumeLevel);

            const volumeEmbed = new EmbedBuilder()
                .setColor(0x0000FF)
                .setAuthor({
                    name: lang.volumeSuccessTitle,
                    iconURL: musicIcons.volumeIcon,
                    url: "https://discord.gg/xQF9f9yUEM"
                })
                .setDescription(lang.volumeSuccessMessage.replace('{volumeLevel}', volumeLevel))
                .setFooter({ text: 'DisTube Player', iconURL: musicIcons.footerIcon });

            return source.channel.send({ embeds: [volumeEmbed] });
        } catch (error) {
            console.error(error);

            return source.channel.send(lang.volumeErrorMessage);
        }
    },
};
