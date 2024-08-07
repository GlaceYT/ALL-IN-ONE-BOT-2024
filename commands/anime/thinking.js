const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const anime = require('anime-actions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('thinking')
        .setDescription('Thinking action!'),
    async execute(interaction) {
        const sender = interaction.user;
        const thinkingGif = await anime.thinking();

        const embed = new EmbedBuilder()
            .setColor('#ffcc00')
            .setDescription(`thinking... 🤔`)
            .setImage(thinkingGif)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
