const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const anime = require('anime-actions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kiss')
        .setDescription('Kiss someone!')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to kiss')
                .setRequired(true)),
    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) {
            // Slash command execution
            const sender = interaction.user;
            const kissedUser = interaction.options.getUser('user');
            const kissGif = await anime.kiss();

            const embed = new EmbedBuilder()
                .setColor('#ffcc00')
                .setDescription(`${sender} is kissing ${kissedUser}! 😘`)
                .setImage(kissGif)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } else {
            // Prefix command execution
            const sender = interaction.author;
            const targetUser = interaction.mentions.users.first();
            const kissGif = await anime.kiss();

            const embed = new EmbedBuilder()
                .setColor('#ffcc00')
                .setDescription(`${sender} is kissing ${targetUser || 'the air'}! 😘`)
                .setImage(kissGif);

            interaction.reply({ embeds: [embed] });
        }
    },
};
