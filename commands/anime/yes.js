const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const anime = require('anime-actions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('yes')
        .setDescription('Agree action!'),
    async execute(interaction) {
        const sender = interaction.user;
        const yesGif = await anime.yes();

        const embed = new EmbedBuilder()
            .setColor('#ffcc00')
            .setDescription(`nodding yes! 👍`)
            .setImage(yesGif)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
