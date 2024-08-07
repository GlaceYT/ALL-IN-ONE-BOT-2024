const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const anime = require('anime-actions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nervous')
        .setDescription('Feeling nervous!'),
    async execute(interaction) {
        const sender = interaction.user;
        const nervousGif = await anime.nervous();

        const embed = new EmbedBuilder()
            .setColor('#ffcc00')
            .setDescription(`feeling nervous! 😬`)
            .setImage(nervousGif)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
