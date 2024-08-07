const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const anime = require('anime-actions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bully')
        .setDescription('Bully someone!')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to bully')
                .setRequired(true)),
    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) {
            // Slash command execution
            const sender = interaction.user;
            const bulliedUser = interaction.options.getUser('user');
            const bullyGif = await anime.bully();

            const embed = new EmbedBuilder()
                .setColor('#ffcc00')
                .setDescription(`${sender} is bullying ${bulliedUser}! 😡`)
                .setImage(bullyGif)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } else {
            // Prefix command execution
            const sender = interaction.author;
            const targetUser = interaction.mentions.users.first();
            const bullyGif = await anime.bully();

            const embed = new EmbedBuilder()
                .setColor('#ffcc00')
                .setDescription(`${sender} is bullying ${targetUser || 'the air'}! 😡`)
                .setImage(bullyGif);

            interaction.reply({ embeds: [embed] });
        }
    },
};
