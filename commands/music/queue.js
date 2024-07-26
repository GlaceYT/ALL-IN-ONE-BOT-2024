


const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const musicIcons = require('../../UI/icons/musicicons');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Show the current music queue'),

    async execute(interaction) {
        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply('**You need to be in a voice channel to view the queue!**');
        }

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
                .setDescription('No songs in the queue.');

            if (interaction.isCommand && interaction.isCommand()) {
                return interaction.reply({ embeds: [noSongsEmbed] });
            } else {
                return interaction.channel.send({ embeds: [noSongsEmbed] });
            }
        }

        const queueEmbed = new EmbedBuilder()
            .setColor('#DC92FF')
            .setAuthor({ 
                name: "Current Queue!", 
                iconURL: musicIcons.beatsIcon ,
                 url: "https://discord.gg/xQF9f9yUEM"
                })
            .setFooter({ text: 'MUSIC PLAYER - Distube', iconURL: musicIcons.footerIcon })   
            .setDescription(`Songs: ${queue.songs.length}`)
            .setTimestamp();

            for (let i = 1; i < queue.songs.length; i++) {
                queueEmbed.addFields(
                    { name: `${i}. ${queue.songs[i].name}`, value: `Duration: ${queue.songs[i].formattedDuration}` }
                );
            }

        if (interaction.isCommand && interaction.isCommand()) {
            await interaction.reply({ embeds: [queueEmbed] });
        } else {
            await interaction.channel.send({ embeds: [queueEmbed] });
        }
    },
};
