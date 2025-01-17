const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const anime = require('anime-actions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('highfive')
        .setDescription('High five someone!')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to high five')
                .setRequired(true)),
    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) {
            // Slash command execution
            const sender = interaction.user;
            const highFivedUser = interaction.options.getUser('user');
            const highFiveGif = await anime.highfive();

            const embed = new EmbedBuilder()
                .setColor('#ffcc00')
                .setDescription(`${sender} gives a high five to ${highFivedUser}! 🙌`)
                .setImage(highFiveGif)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } else {
            // Prefix command execution
            const sender = interaction.author;
            const targetUser = interaction.mentions.users.first();
            const highFiveGif = await anime.highfive();

            const embed = new EmbedBuilder()
                .setColor('#ffcc00')
                .setDescription(`${sender} gives a high five to ${targetUser || 'the air'}! 🙌`)
                .setImage(highFiveGif);

            interaction.reply({ embeds: [embed] });
        }
    },
};
