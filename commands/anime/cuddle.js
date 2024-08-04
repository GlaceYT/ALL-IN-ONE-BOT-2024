const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const anime = require('anime-actions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cuddle')
        .setDescription('Cuddle someone!')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to cuddle')
                .setRequired(true)),
    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) {
            // Slash command execution
            const sender = interaction.user;
            const cuddledUser = interaction.options.getUser('user');
            const cuddleGif = await anime.cuddle();

            const embed = new EmbedBuilder()
                .setColor('#ffcc00')
                .setDescription(`${sender} cuddles ${cuddledUser}! 🤗`)
                .setImage(cuddleGif)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } else {
            // Prefix command execution
            const sender = interaction.author;
            const targetUser = interaction.mentions.users.first();
            const cuddleGif = await anime.cuddle();

            const embed = new EmbedBuilder()
                .setColor('#ffcc00')
                .setDescription(`${sender} cuddles ${targetUser || 'the air'}! 🤗`)
                .setImage(cuddleGif);

            interaction.reply({ embeds: [embed] });
        }
    },
};
