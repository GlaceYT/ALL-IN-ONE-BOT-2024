const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const anime = require('anime-actions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pat')
        .setDescription('Pat someone!')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to pat')
                .setRequired(true)),
    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) {
            // Slash command execution
            const sender = interaction.user;
            const pattedUser = interaction.options.getUser('user');
            const patGif = await anime.pat();

            const embed = new EmbedBuilder()
                .setColor('#ffcc00')
                .setDescription(`${sender} pats ${pattedUser}! 🐾`)
                .setImage(patGif)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } else {
            // Prefix command execution
            const sender = interaction.author;
            const targetUser = interaction.mentions.users.first();
            const patGif = await anime.pat();

            const embed = new EmbedBuilder()
                .setColor('#ffcc00')
                .setDescription(`${sender} pats ${targetUser || 'the air'}! 🐾`)
                .setImage(patGif);

            interaction.reply({ embeds: [embed] });
        }
    },
};
