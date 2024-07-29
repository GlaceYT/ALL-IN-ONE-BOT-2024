const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const anime = require('anime-actions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stare')
        .setDescription('Stare at someone!')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to stare at')
                .setRequired(true)),
    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) {
            // Slash command execution
            const sender = interaction.user;
            const staredUser = interaction.options.getUser('user');
            const stareGif = await anime.stare();

            const embed = new EmbedBuilder()
                .setColor('#ffcc00')
                .setDescription(`${sender} stares at ${staredUser}! 👀`)
                .setImage(stareGif)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } else {
            // Prefix command execution
            const sender = interaction.author;
            const targetUser = interaction.mentions.users.first();
            const stareGif = await anime.stare();

            const embed = new EmbedBuilder()
                .setColor('#ffcc00')
                .setDescription(`${sender} stares at ${targetUser || 'the air'}! 👀`)
                .setImage(stareGif);

            interaction.reply({ embeds: [embed] });
        }
    },
};
