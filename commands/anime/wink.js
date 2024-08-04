const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const anime = require('anime-actions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wink')
        .setDescription('Wink at someone!')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to wink at')
                .setRequired(true)),
    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) {
            // Slash command execution
            const sender = interaction.user;
            const winkedUser = interaction.options.getUser('user');
            const winkGif = await anime.wink();

            const embed = new EmbedBuilder()
                .setColor('#ffcc00')
                .setDescription(`${sender} winks at ${winkedUser}! 😉`)
                .setImage(winkGif)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } else {
            // Prefix command execution
            const sender = interaction.author;
            const targetUser = interaction.mentions.users.first();
            const winkGif = await anime.wink();

            const embed = new EmbedBuilder()
                .setColor('#ffcc00')
                .setDescription(`${sender} winks at ${targetUser || 'the air'}! 😉`)
                .setImage(winkGif);

            interaction.reply({ embeds: [embed] });
        }
    },
};
