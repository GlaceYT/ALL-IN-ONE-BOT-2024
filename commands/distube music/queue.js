const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const musicIcons = require('../../UI/icons/musicicons');
const lang = require('../../events/loadLanguage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription(lang.queueDescription),

    async execute(interaction) {
        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply(lang.queueNoVoiceChannel);
        }

        const queue = interaction.client.distube.getQueue(interaction.guildId);

        if (!queue || !queue.songs.length) {
            const noSongsEmbed = new EmbedBuilder() 
                .setColor(0x0000FF)
                .setAuthor({ 
                    name: lang.queueNoSongsTitle, 
                    iconURL: musicIcons.wrongIcon,
                    url: "https://discord.gg/xQF9f9yUEM"
                })
                .setFooter({ text: 'Distube Player', iconURL: musicIcons.footerIcon })   
                .setDescription(lang.queueNoSongsMessage);

            if (interaction.isCommand && interaction.isCommand()) {
                return interaction.reply({ embeds: [noSongsEmbed] });
            } else {
                return interaction.channel.send({ embeds: [noSongsEmbed] });
            }
        }

        const queueEmbed = new EmbedBuilder()
            .setColor(0x0000FF)
            .setAuthor({ 
                name: lang.queueTitle, 
                iconURL: musicIcons.beatsIcon,
                url: "https://discord.gg/xQF9f9yUEM"
            })
            .setFooter({ text: 'Distube Player', iconURL: musicIcons.footerIcon })
            .setDescription(`${lang.queueSongs} ${queue.songs.length}`)
            .setTimestamp();

        for (let i = 1; i < queue.songs.length; i++) {
            queueEmbed.addFields(
                { name: `${i}. ${queue.songs[i].name}`, value: `${lang.queueDuration} ${queue.songs[i].formattedDuration}` }
            );
        }

        if (interaction.isCommand && interaction.isCommand()) {
            await interaction.reply({ embeds: [queueEmbed] });
        } else {
            await interaction.channel.send({ embeds: [queueEmbed] });
        }
    },
};
