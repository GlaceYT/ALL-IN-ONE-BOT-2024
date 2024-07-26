const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const anime = require('anime-actions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cry')
        .setDescription('Cry action!'),
    async execute(interaction) {
        const sender = interaction.user;
        const cryGif = await anime.cry();

        const embed = new EmbedBuilder()
            .setColor('#ffcc00')
            .setDescription(`${sender} is crying! 😢`)
            .setImage(cryGif)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
