const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const anime = require('anime-actions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cry')
        .setDescription('Cry action!'),
        async execute(interaction) {
            if (interaction.isCommand && interaction.isCommand()) {
                // Slash command execution
                const sender = interaction.user;
                const cryUser = interaction.options.getUser('user');
                const cryGif = await anime.cry();
    
                const embed = new EmbedBuilder()
                    .setColor('#ffcc00')
                    .setDescription(`${sender} is crying!`)
                    .setImage(cryGif)
                    .setTimestamp();
    
                await interaction.reply({ embeds: [embed] });
            } else {
                // Prefix command execution
                const sender = interaction.author;
                const targetUser = interaction.mentions.users.first();
                const cryGif = await anime.cry();
    
                const embed = new EmbedBuilder()
                    .setColor('#ffcc00')
                    .setDescription(`${sender} is crying!`)
                    .setImage(cryGif);
    
                interaction.reply({ embeds: [embed] });
            }
        },
};
