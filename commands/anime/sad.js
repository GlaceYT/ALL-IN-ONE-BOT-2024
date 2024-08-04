const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const anime = require('anime-actions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sad')
        .setDescription('Feeling sad!'),
    async execute(interaction) {
        const sender = interaction.user;
        const sadGif = await anime.sad();

        const embed = new EmbedBuilder()
            .setColor('#ffcc00')
            .setDescription(`feeling sad! 😔`)
            .setImage(sadGif)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
