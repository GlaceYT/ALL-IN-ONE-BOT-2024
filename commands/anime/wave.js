const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const anime = require('anime-actions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wave')
        .setDescription('Wave at someone!')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to wave at')
                .setRequired(true)),
    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) {
            // Slash command execution
            const sender = interaction.user;
            const wavedUser = interaction.options.getUser('user');
            const waveGif = await anime.wave();

            const embed = new EmbedBuilder()
                .setColor('#ffcc00')
                .setDescription(`${sender} waves at ${wavedUser}! 👋`)
                .setImage(waveGif)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } else {
            // Prefix command execution
            const sender = interaction.author;
            const targetUser = interaction.mentions.users.first();
            const waveGif = await anime.wave();

            const embed = new EmbedBuilder()
                .setColor('#ffcc00')
                .setDescription(`${sender} waves at ${targetUser || 'the air'}! 👋`)
                .setImage(waveGif);

            interaction.reply({ embeds: [embed] });
        }
    },
};
