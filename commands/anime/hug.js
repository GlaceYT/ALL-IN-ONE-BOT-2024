const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const anime = require('anime-actions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hug')
        .setDescription('Hug someone!')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to hug')
                .setRequired(true)),
    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) {
            // Slash command execution
            const sender = interaction.user;
            const huggedUser = interaction.options.getUser('user');
            const hugGif = await anime.hug();

            const embed = new EmbedBuilder()
                .setColor('#ffcc00')
                .setDescription(`${sender} is hugging ${huggedUser}! 🤗`)
                .setImage(hugGif)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } else {
            // Prefix command execution
            const sender = interaction.author;
            const targetUser = interaction.mentions.users.first();
            const hugGif = await anime.hug();

            const embed = new EmbedBuilder()
                .setColor('#ffcc00')
                .setDescription(`${sender} is hugging ${targetUser || 'the air'}! 🤗`)
                .setImage(hugGif);

            interaction.reply({ embeds: [embed] });
        }
    },
};
