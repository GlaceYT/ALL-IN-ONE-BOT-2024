const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const { DisTubeError } = require('distube');
const musicIcons = require('../../UI/icons/musicicons');
const lang = require('../../events/loadLanguage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription(lang.skipDescription),

    async execute(interaction) {
        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply(lang.skipNoVoiceChannel);
        }

        const permissions = voiceChannel.permissionsFor(interaction.client.user);
        if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
            return interaction.reply(lang.skipNoPermissions);
        }

        try {
            await interaction.reply(lang.skipInProgress);

            // Skip the song
            await interaction.client.distube.skip(voiceChannel);

            // Check if there are songs left in the queue
            const queue = interaction.client.distube.getQueue(interaction.guildId);
            if (!queue || !queue.songs.length) {
                const noSongsEmbed = new EmbedBuilder()
                    .setColor(0x0000FF)
                    .setAuthor({ 
                        name: lang.skipNoSongsTitle, 
                        iconURL: musicIcons.wrongIcon,
                        url: "https://discord.gg/xQF9f9yUEM"
                    })
                    .setFooter({ text: 'Distube Player', iconURL: musicIcons.footerIcon })   
                    .setDescription(lang.skipNoSongsMessage);

                return interaction.reply({ embeds: [noSongsEmbed] });
            }

            // Get the next song
            const nextSong = queue.songs[0];
            const nextSongEmbed = new EmbedBuilder()
                .setColor(0x0000FF)
                .setAuthor({ 
                    name: lang.skipSuccessTitle, 
                    iconURL: musicIcons.skipIcon,
                    url: "https://discord.gg/xQF9f9yUEM"
                })
                .setFooter({ text: 'Distube Player', iconURL: musicIcons.footerIcon })  
                .addFields(
                    { name: lang.skipTitleField, value: nextSong.name },
                    { name: lang.skipDurationField, value: nextSong.formattedDuration }
                );

            await interaction.reply({ embeds: [nextSongEmbed] });
        } catch (error) {
            console.error(error);

            if (error instanceof DisTubeError && error.code === 'NO_QUEUE') {
                const noQueueEmbed = new EmbedBuilder()
                    .setColor(0x0000FF)
                    .setAuthor({ 
                        name: lang.skipNoQueueTitle, 
                        iconURL: musicIcons.wrongIcon,
                        url: "https://discord.gg/xQF9f9yUEM"
                    })
                    .setFooter({ text: 'Distube Player', iconURL: musicIcons.footerIcon })  
                    .setDescription(lang.skipNoQueueMessage);

                await interaction.reply({ embeds: [noQueueEmbed] });
            } else if (error instanceof DisTubeError && error.code === 'NO_UP_NEXT') {
                const noUpNextEmbed = new EmbedBuilder()
                    .setColor(0x0000FF)
                    .setAuthor({ 
                        name: lang.skipNoUpNextTitle, 
                        iconURL: musicIcons.wrongIcon,
                        url: "https://discord.gg/xQF9f9yUEM"
                    })
                    .setFooter({ text: 'Distube Player', iconURL: musicIcons.footerIcon })  
                    .setDescription(lang.skipNoUpNextMessage);

                await interaction.reply({ embeds: [noUpNextEmbed] });
            } else {
                const errorMessage = lang.skipErrorMessage;
                await interaction.reply(errorMessage);
            }
        }
    },
};
