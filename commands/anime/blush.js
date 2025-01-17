const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const anime = require('anime-actions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('blush')
        .setDescription('Blush action!'),
    async execute(interaction) {
        const sender = interaction.user;
        const blushGif = await anime.blush();

        const embed = new EmbedBuilder()
            .setColor('#ffcc00')
            .setDescription(`${sender} is blushing! ☺️`)
            .setImage(blushGif)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};