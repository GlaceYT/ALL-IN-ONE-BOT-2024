const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const anime = require('anime-actions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('scream')
        .setDescription('Scream action!'),
    async execute(interaction) {
        const sender = interaction.user;
        const screamGif = await anime.scream();

        const embed = new EmbedBuilder()
            .setColor('#ffcc00')
            .setDescription(`screaming! 😱`)
            .setImage(screamGif)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
