const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const anime = require('anime-actions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bonk')
        .setDescription('Bonk someone!')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to bonk')
                .setRequired(true)),
    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) {
            // Slash command execution
            const sender = interaction.user;
            const bonkedUser = interaction.options.getUser('user');
            const bonkGif = await anime.bonk();

            const embed = new EmbedBuilder()
                .setColor('#ffcc00')
                .setDescription(`${sender} is bonking ${bonkedUser}! 🤦‍♂️`)
                .setImage(bonkGif)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } else {
            // Prefix command execution
            const sender = interaction.author;
            const targetUser = interaction.mentions.users.first();
            const bonkGif = await anime.bonk();

            const embed = new EmbedBuilder()
                .setColor('#ffcc00')
                .setDescription(`${sender} is bonking ${targetUser || 'the air'}! 🤦‍♂️`)
                .setImage(bonkGif);

            interaction.reply({ embeds: [embed] });
        }
    },
};
