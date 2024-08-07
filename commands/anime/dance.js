const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const anime = require('anime-actions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dance')
        .setDescription('Dance like nobody\'s watching!'),
        async execute(interaction) {
            if (interaction.isCommand && interaction.isCommand()) {
                // Slash command execution
                const sender = interaction.user;
                const danceUser = interaction.options.getUser('user');
                const danceGif = await anime.dance();
    
                const embed = new EmbedBuilder()
                    .setColor('#ffcc00')
                    .setDescription(`${sender} is dancing!`)
                    .setImage(danceGif)
                    .setTimestamp();
    
                await interaction.reply({ embeds: [embed] });
            } else {
                // Prefix command execution
                const sender = interaction.author;
                const targetUser = interaction.mentions.users.first();
                const danceGif = await anime.dance();
    
                const embed = new EmbedBuilder()
                    .setColor('#ffcc00')
                    .setDescription(`${sender} is dancing!`)
                    .setImage(danceGif);
    
                interaction.reply({ embeds: [embed] });
            }
        },
};
